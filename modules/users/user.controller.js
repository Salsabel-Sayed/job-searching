import { User } from "./user.model.js";
import { catchError } from "./../../middleWare/handleErrors/catchError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { appError } from "../../middleWare/handleErrors/appError.js";
import { sendOTPByMail } from "../../middleWare/recovryEmail/email.js";
import { html, sendEmail } from "../../utils/sendEmail.js";
import { nanoid } from "nanoid";

// * add user (signup)

export const signup = catchError(async (req, res, next) => {
  // req.body.userName = req.body.firstName + " " + req.body.lastName;
  const addUser = await User.create(req.body);

  res.json({ message: "added", addUser });
});

// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * (sign in)

// export const signIn = catchError(async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });
//   const password = bcrypt.compareSync(req.body.password, user.password);
//   if (!user || !password) return next(new appError("user not found"), 404);

//   jwt.sign(
//     {
//       userId: user._id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       userName: user.userName,
//       phoneNumber: user.phoneNaumber,
//       email: user.email,
//       passwrod: user.password,
//       DOB: user.DOB,
//       role: user.role,
//       status: "online",
//     },
//     "thisIsMyFirstBackEdExam",
//     async (err, token) => {
//       await User.updateOne({ _id: user._id }, { $set: { status: "online" } });
//       res.json({ message: "signin", token });
//     }
//   );
// });

export const signIn = catchError(async (req, res, next) => {
  const { email, password, mobileNumber, recoveryEmail } = req.body;
  const userExist = await User.findOne({
    $or: [{ email }, { mobileNumber }, { recoveryEmail }],
  });
  if (!userExist) {
    return next(new appError("invalid credentials!", 404));
  }
  const match = bcrypt.compareSync(password, userExist.password);

  if (!match) {
    return next(new appError("invalid credentials!", 404));
  }
  const token = jwt.sign({ id: userExist._id }, "userwithcompaniesAndjob");

  await User.updateOne({ _id: userExist._id }, { status: "online" });
  return res.json({ message: "signed in successfully", token });
});

// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * update user (only user can update)

export const updateUser = catchError(async (req, res, next) => {
  const userId = req.user.id;

  const findUser = await User.findOne({
    $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }],
    id: { $ne: userId },
  });

  if (findUser._id.toString() !== userId) {
    return next(new appError("another user info!!", 404));
  }
  if (findUser._id.toString() == userId && findUser.email ) {
   if(findUser.status === "offline") return next(new appError("user offline",404))
     if (findUser.firstName) {
      req.body.userName = findUser.firstName + " " + userId.lastName;
    } else if (findUser.lastName) {
      req.body.userName = userId.firstName + " " + findUser.lastName;
    } else if (findUser.firstName && findUser.lastName) {
      req.body.userName = findUser.firstName + " " + findUser.lastName;
    }
    const updated = await User.updateOne({ _id: userId }, req.body);
    res.json({ message: "Done!", updated });
    
  }
});

// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * delete user (only user can delete)

export const deleteUser = catchError(async (req, res, next) => {
  const user = await User.deleteOne({ _id: req.user.id });
  if (!user) return next(new appError("user not found", 404));
  if(user.status === "offline") return next(new appError("user offline !!! "))
  res.json({ message: "delete", user });
});
// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * get user data (only user can get it)

export const getUserData = catchError(async (req, res, next) => {
  const user = await User.findOne({_id:req.user.id});
  if (!user) return next(new appError("user not found", 404));
  if (user.status === "online") {
    return res.json({ message: "get", user });
  } else {
    return next(new appError("user is offline", 404));
  }
});

// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * Get profile data for another user only HR can do

export const getAnotherUserHR = catchError(async (req, res, next) => {
  const admin = await User.findOne({_id:req.user.id});
  if (!admin) return next(new appError("user not found", 404));
  if (admin.role !== "Company_HR") return next(new appError("user is not a candidate", 404));
  const user = await User.findById(req.params.id);
  console.log("user", user.role);
  res.json({message:"get user profile by HR only", user})
});

// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * Get profile data for another user

export const getAnotherUser = catchError(async (req, res, next) => {
  const admin = await User.findOne({_id:req.user.id});
  if(admin.status === "offline")return next(new appError("signin first!"))
    if (!admin) return next(new appError("user not found", 404));
  if(admin && admin.status === "online"){
    const user = await User.findById(req.params.id);
  res.json({message:"get user profile", user})
  }
});

// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * Get all accounts associated to a specific recovery Email

export const specfcRecvryEmail = catchError(async (req, res, next) => {
  const user = await User.find({ recoveryEmail: req.params.recoveryEmail });
  if (user.length === 0)
    return next(new appError("recoveryEmail not found", 404));
  return res.json({ message: "get", user });
});

// ? ////////////////////////////////////////////////////////////////////////////////////////////////
// * otp msg to email (request otp and update password)

export const requestUpdatePassword = catchError(async (req, res, next) => {
  const user = await User.findOne({_id:req.user.id});
  if (!user) return next(new appError("user not found", 404));

  const otp = nanoid(6)
     user.otp = otp;
    //  user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save(); 
    const html1 = html(otp)
    sendEmail({to:user.email,subject:"otp",html:html1})
    return res.json({message:"check email"})
});

 export const updatePassword = catchError(async (req, res, next) => {  
    const { otp, newPassword } = req.body;  

    const user = await User.findById(req.user.id);  
    if (!user) return next(new appError("User not found", 404));  

    if (!user.otp || user.otp !== otp) {  
        return next(new appError('Invalid or expired OTP.', 400));  
    }  

    // Check if newPassword is valid  
    if (newPassword.length < 3) {  
        return next(new appError("Password must be at least 3 characters", 400));  
    }  
    // Update password (you should hash the password using a library like bcrypt)  
    const hashedPassword = await bcrypt.hash(newPassword, 8);
    user.password = newPassword; // In practice, be sure to hash this password  
    user.otp = undefined; // Clear OTP after successful update  
    await user.save();  

    return res.status(200).json({ message: "Password updated successfully!" });  
});
