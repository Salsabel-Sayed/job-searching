import { appError } from "../../middleWare/handleErrors/appError.js"
import { catchError } from "../../middleWare/handleErrors/catchError.js"
import {Job} from "../jobs/job.model.js"
import { Application } from "./application.model.js"




// * add company
export const addApplication = catchError(async(req,res,next)=>{
    const app = await Application.insertMany(req.body)
    if(!app) return next(new appError("campany not found",400))
        res.status(200).json({message:"added",app})
})

// ? ////////////////////////////////////////////////////////////////////////////////////
// *get all applications for specific job

    export const getAllAppSpecific = catchError(async(req,res,next)=>{
        try {  
            const job = await Job.findById(req.params.id).populate("addedBy"); 
            if (!job) {  
                return next(new appError("Job not found", 404));  
            }  
            if (job.addedBy.role === "Company_HR") {  
                const applications = await Application.find({jobId:job.id})
                res.json({ message: "Applications retrieved successfully", applications }); 
            } else {  
                return next(new appError("Unauthorized access", 401));  
            }  
        } catch (error) {  
            next(error); 
        }  
   } )
