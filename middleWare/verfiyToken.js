import { appError } from "./handleErrors/appError.js";
import { catchError } from "./handleErrors/catchError.js";
import jwt  from 'jsonwebtoken';


export const verifyToken = catchError(async(req,res,next)=>{
    const token = req.header('authorization')
    jwt.verify(token, "thisIsMyFirstBackEdExam",async(err,decoded)=>{
        if(err) return next(new appError('No token provided',401))
            next()
    })
})