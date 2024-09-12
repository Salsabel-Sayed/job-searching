import { Router } from "express";
import { addCompany, deleteCompany, getCompany, searchName, updateCompany } from "./copmany.controller.js";
import { verifyToken } from "../../middleWare/verfiyToken.js";
import { companyAddingVal } from "./companyValidation.js";

import { validate } from './../../middleWare/validations/validate.js';



const companyRoutes = Router()
companyRoutes.use(verifyToken)
companyRoutes.post('/addCompany/',validate(companyAddingVal),addCompany)
companyRoutes.put('/updateCompany/',updateCompany)
companyRoutes.delete('/deleteCompany/',deleteCompany)
companyRoutes.get('/getCompany/',getCompany)
companyRoutes.get('/searchName/',searchName)




export default companyRoutes