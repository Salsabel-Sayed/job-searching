import { Router } from "express";
import { addApplication, getAllAppSpecific } from "./application.controller.js";
import { verifyToken } from "../../middleWare/verfiyToken.js";





const applicationsRoutes = Router()

applicationsRoutes.use(verifyToken)

applicationsRoutes.post('/addApplication',addApplication)
applicationsRoutes.get('/getAllAppSpecific/:id',getAllAppSpecific)



export default applicationsRoutes