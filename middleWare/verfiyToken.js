import { User } from "../modules/users/user.model.js";
import { appError } from "./handleErrors/appError.js";
import { catchError } from "./handleErrors/catchError.js";
import jwt from "jsonwebtoken";


export const verifyToken = catchError(async (req, res, next) => {
  const token = req.header("authorization");
  jwt.verify(token, "userwithcompaniesAndjob", async (err, decoded) => {
    if (err) return next(new appError("No token provided", 401));
    req.user = decoded;
    next();
  });
});

//  export const allowedTo = (...roles)=>{

//     return catchError(async(req,res,next)=>{
//         if(roles.includes(req.user.role))
//             return next()
//         return next(new appError('you dont have permission to perform this endpoint',401))
// })}

// export const verifyToken = catchError(
//    (roles = []) => {
//   return async (req, res, next) => {
//     const { authorization } = req.headers;
//     if (!authorization) {
//       return next(new appError("no authorization was sent",404))
//     }
//     if (!authorization.startsWith("bearer")) {
//       return next(new appError("in valid bearer key",404))
//     }
//     const splitToken = authorization.split("bearer")[1];
//     const decode = jwt.verify(splitToken, process.env.TOKEN_SIGNATURE);
//     if (!decode.id) {
//       return next(new appError("in valid payload",404))
//     }
//     const user = await User.findById(decode.id);
//     if (!user) {
//       return next(new appError("no user found!",404))
//     }
//     if (!roles.includes(user.role)) {
//       return next(new appError("you are not authorized to access this endpoint!",404))
//     }
//     req.user = user;
//     return next();
//   };
// }
// )
