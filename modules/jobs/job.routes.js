import { Router } from "express";
import { verifyToken } from "../../middleWare/verfiyToken.js";
import { addjob, applyJob, deletejob, getAlljob, getAlljobWith, updatejob } from "./job.controller.js";



const jobRouter = Router()
jobRouter.use(verifyToken)
jobRouter.post('/addJob',addjob)
jobRouter.put('/updateJob/:id',updatejob)
jobRouter.delete('/deleteJob/:id',deletejob)
jobRouter.get('/getAlljob/',getAlljob)
jobRouter.get('/getAlljobWith/',getAlljobWith)
jobRouter.put('/applyJob/:id',applyJob)




export default jobRouter