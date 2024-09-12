import { Router } from "express";
import { verifyToken } from "../../middleWare/verfiyToken.js";
import {

  addjob,
  applyToJob,
  deletejob,
  excelSheet,
  getAllAppSpecific,
  getAllJobs,
  getAlljobWithFilter,
  getSpecificJob,
  likeOrUnlike,
  pagination,
  rateJob,
  updatejob,
} from "./job.controller.js";
import { filteration, uploadFile } from './../../utils/multer.js';




const jobRouter = Router();
jobRouter.use(verifyToken);
jobRouter.post("/addJob", addjob);
jobRouter.put("/updateJob/", updatejob);
jobRouter.delete("/deleteJob/", deletejob);
jobRouter.get("/getAllJobs/", getAllJobs);
jobRouter.get("/getSpecificJob/", getSpecificJob);
jobRouter.get("/getAlljobWithFilter/", getAlljobWithFilter);
jobRouter.post("/applyToJob/", uploadFile(filteration.image).single("userResume"), applyToJob);
jobRouter.post("/excelSheet/", excelSheet);

jobRouter.get('/getAllAppSpecific/:id', getAllAppSpecific)
jobRouter.put('/likeandunlike/:id', likeOrUnlike)
jobRouter.put('/rateJob/:id', rateJob)
jobRouter.get('/pagination/', pagination)


export default jobRouter;
