
import bcrypt from "bcrypt"
import { appError } from "./handleErrors/appError.js"
import { User } from "../modules/users/user.model.js"




export const checkEmail = async(req,res,next)=>{
    let emailFound = await User.findOne({email:req.body.email})
        if(emailFound) return next(new appError('Email already exists',400))
        req.body.password = bcrypt.hashSync(req.body.password, 8)
    next()
    
}