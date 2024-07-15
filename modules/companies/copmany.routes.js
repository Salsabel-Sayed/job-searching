import { Router } from "express";
import { addCompany, deleteCompany, getCompany, searchName, updateCompany } from "./copmany.controller.js";
import { verifyToken } from "../../middleWare/verfiyToken.js";



const companyRoutes = Router()
companyRoutes.use(verifyToken)
companyRoutes.post('/addCompany',addCompany)
companyRoutes.put('/updateCompany/:id',updateCompany)
companyRoutes.delete('/deleteCompany/:id',deleteCompany)
companyRoutes.get('/getCompany/:id',getCompany)
companyRoutes.get('/searchName/',searchName)




export default companyRoutes