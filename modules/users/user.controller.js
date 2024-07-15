import { User } from "./user.model.js"
import { catchError } from './../../middleWare/handleErrors/catchError.js';
import jwt from "jsonwebtoken";
import  bcrypt  from 'bcrypt';
import { appError } from "../../middleWare/handleErrors/appError.js";
import { sendOTPByMail } from "../../middleWare/recovryEmail/email.js";


// * add user 

export const signup = catchError(async(req,res)=>{  
    req.body.userName = req.body.firstName +" "+ req.body.lastName
    const addUser = await User.insertMany(req.body)
    
    res.json({message:'added',addUser})
})


// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * add user 

export const signIn = catchError(async(req,res,next)=>{  
    const user = await User.findOne({email:req.body.email})
    const password = bcrypt.compareSync(req.body.password , user.password)
    if(!user || !password ) return next(new appError("user not found"),404)

        jwt.sign({
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          phoneNumber: user.phoneNaumber,
          email: user.email,
          passwrod: user.password,
          DOB:user.DOB,
          role:user.role,
          status:"online"
        },"thisIsMyFirstBackEdExam",async(err,token)=>{
            await User.updateOne({ _id: user._id }, { $set: { status: "online" } });
            res.json({message:'signin',token})
        });
})

// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * update user (only user can update)

export const updateUser = catchError(async(req,res,next)=>{
    const existingUserWithEmail = await User.findOne({ email: req.body.email });  
const existingUserWithMobileNumber = await User.findOne({ mobileNumber: req.body.mobileNumber });  

if (existingUserWithEmail && existingUserWithEmail._id !== req.params.id) {  
    return next(new appError('Email is already in use',404));  
}  

if (existingUserWithMobileNumber && existingUserWithMobileNumber._id !== req.params.id) {  
    return next(new appError('Mobile number is already in use',404));  
} 


    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        recoveryEmail: req.body.recoveryEmail,
        DOB: req.body.DOB,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
      },
      req.body,
      { new: true }
    )
    if(!user) return next(new appError('user not found',404))
        if(user.status === "online"){
            res.json({message:'update',user})
        }else{
            return next(new appError({message:'user is offline'},404))
        }
        
})

// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * delete user (only user can delete)

export const deleteUser = catchError(async(req,res,next)=>{
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return next(new appError('user not found',404))
        res.json({message:'delete',user})
}
)
// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * get user data (only user can get it)

export const getUserData = catchError(async(req,res,next)=>{
    
    const user = await User.findById(req.params.id);
    if(!user) return next(new appError('user not found',404))
        if(user.status === "online"){
            return res.json({message:'get',user})
        }else{
            return next(new appError('user is offline',404))
        }
})

// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * Get profile data for another user only HR can do

export const getAnotherUserHR = catchError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    const admin = await User.findOne({},{role:"Company_HR"})
    if(!user) return next(new appError('user not found',404))
        if(admin.role === "Company_HR"){
            return res.json({message:'get',user})
        }else{
            return next(new appError('user is not a candidate',404))
        }
})

// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * Get profile data for another user

export const getAnotherUser = catchError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
   
    if(!user) return next(new appError('user not found',404))
        
            return res.json({message:'get',user})
})


// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * Update password 

export const updatePassword = catchError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user) return next(new appError('user not found',404))
        if(req.body.password.length < 6) return next(new appError('password must be at least 6 characters',400))
            const updated = await User.updateOne({password: req.body.password})
        return res.json({message:'update',updated})
})

// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * forget password by OTP

// export const forgetPassword = catchError(async (req, res, next) => {  
//     // Generate OTP  
//     const otp = generateOTP();  

//     // Send OTP via email  
//     sendOTPByMail('slsabilkamal99@gmail.com', otp);  

//     // Save the OTP in the database or perform other necessary actions  
//     // Include your logic here  

//     // Proceed with the password reset flow  
//     // Include your logic here  

//     res.json({ message: 'OTP sent successfully' });  
// }); 

// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * Get all accounts associated to a specific recovery Email 

export const specfcRecvryEmail = catchError(async(req,res,next)=>{
    const user = await User.find({recoveryEmail:req.params.recoveryEmail})
    if(user.length === 0) return next(new appError('recoveryEmail not found',404))
        return res.json({message:'get',user})
})