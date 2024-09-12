import { Router } from "express";
import { checkEmail } from "../../middleWare/checkEmail.js";
import {
  deleteUser,
  getAnotherUser,
  getAnotherUserHR,
  getUserData,
  signIn,
  signup,
  specfcRecvryEmail,
  updateUser,
  requestUpdatePassword,
  updatePassword,
} from "./user.controller.js";
import { signUpVal } from "./user.validation.js";
import { validate } from "../../middleWare/validations/validate.js";
import { verifyToken } from "./../../middleWare/verfiyToken.js";

const userRoutes = Router();

// verifyToken

userRoutes.post("/signup", validate(signUpVal), checkEmail, signup);
userRoutes.post("/signin", signIn);
userRoutes.put("/updateUser", verifyToken, updateUser);
userRoutes.delete("/deleteUser/", verifyToken, deleteUser);
userRoutes.get("/getUserData/", verifyToken, getUserData);
userRoutes.get("/getAnotherUserHR/:id", verifyToken, getAnotherUserHR);
userRoutes.get("/getAnotherUser/:id", verifyToken, getAnotherUser);
userRoutes.get("/specfcRecvryEmail/:recoveryEmail", specfcRecvryEmail);
userRoutes.get("/requestUpdatePassword/", verifyToken, requestUpdatePassword);
userRoutes.put("/updatePassword/", verifyToken, updatePassword);

export default userRoutes;
