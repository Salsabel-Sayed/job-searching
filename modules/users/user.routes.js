import { Router } from "express";
import { checkEmail } from "../../middleWare/checkEmail.js";
import { deleteUser, getAnotherUser, getAnotherUserHR, getUserData, signIn, signup, specfcRecvryEmail, updatePassword, updateUser } from "./user.controller.js";
import { signUpVal } from "./user.validation.js";
import { validate } from "../../middleWare/validations/validate.js";
import { verifyToken } from './../../middleWare/verfiyToken.js';





const userRoutes = Router()

// verifyToken
userRoutes.use(verifyToken)
userRoutes.post('/signup',validate(signUpVal),checkEmail,signup)
userRoutes.post('/signin',signIn)
userRoutes.put('/updateUser/:id',verifyToken,updateUser)
userRoutes.delete('/deleteUser/:id',verifyToken,deleteUser)
userRoutes.get('/getUserData/:id',verifyToken,getUserData)
userRoutes.get('/getAnotherUserHR/:id',verifyToken,getAnotherUserHR)
userRoutes.get('/getAnotherUser/:id',verifyToken,getAnotherUser)
userRoutes.get('/updatePassword/:id',verifyToken,updatePassword)
userRoutes.get('/specfcRecvryEmail/:recoveryEmail',specfcRecvryEmail)


export default userRoutes