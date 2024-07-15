import { appError } from "../../middleWare/handleErrors/appError.js"
import { catchError } from "../../middleWare/handleErrors/catchError.js"
import { Company } from "../companies/company.model.js"
import { Job } from "./job.model.js"
import { Application } from './../applications/application.model.js';




// * add job
export const addjob = catchError(async(req,res,next)=>{
    const job = await Job.insertMany(req.body)
    if(!job) return next(new appError("campany not found",400))
        res.status(200).json({message:"added",job})
})

// ? ////////////////////////////////////////////////////////////////////////////////////
// * Update job data

export const updatejob = catchError(async(req,res,next)=>{
    const job = await Job.findById(req.params.id).populate("addedBy","role")

    if(!job) return next(new appError("campany not found",400))
            if(job.addedBy.role === "Company_HR"){
                const updateWithRole = await Job.findByIdAndUpdate(req.params.id , req.body ,{ new: true })
            res.json({message:"updated",updateWithRole})
            }else{
                next(new appError("the editor not HR company", 400))
            }
        
}
)
// ? ////////////////////////////////////////////////////////////////////////////////////
// * delete job data

export const deletejob = catchError(async(req,res,next)=>{
    const job = await Job.findById(req.params.id).populate("addedBy","role")

    if(!job) return next(new appError("campany not found",400))
        if(job.addedBy.role === "Company_HR"){
            const deleteWithRole = await Job.findByIdAndDelete(req.params.id , req.body ,{ new: true })
            res.json({message:"deleted",deleteWithRole})
        }else{
            next(new appError("the editor not HR job", 400))
        }
}
)

// ? ////////////////////////////////////////////////////////////////////////////////////
// * Get all Jobs with their company’s information.

export const getAlljob = catchError(async(req,res,next)=>{
    const job = await Job.find()
    if(!job) return next(new appError("job not found",400))
        
            res.json({message:"get all jobs",job})
})

// ? ////////////////////////////////////////////////////////////////////////////////////
// * Get all Jobs that match the following filters with jobTitle and jobLocation

export const getAlljobWith = catchError(async(req,res,next)=>{
    const jobTitleQuery = req.query.jobTitle
    const jobLocation = req.query.jobLocation
    const job = await Job.find({ jobTitle: jobTitleQuery, jobLocation: jobLocation }).exec()
    if(!job) return next(new appError("job not found",400))
        if(jobTitleQuery || jobLocation ){
            res.json({message:"get all jobs",job})
        }

})

// ? ////////////////////////////////////////////////////////////////////////////////////
// * Apply to Job

export const applyJob = catchError(async(req,res,next)=>{
    const jobData = await Job.findById(req.params.id).populate("addedBy","role")
    if(!jobData) return next(new appError("job not found",400))
    

    if(!jobData) return next(new appError("job not found",401))
        if(jobData.addedBy.role !== "User") return next(new appError("the editor not user", 400))


            const newApplication = new Application({  
                
                    jobId:req.body.jobId,
                    userId:req.body.userId,
                    userTechSkills:req.body.userTechSkills,
                    userSoftSkills:req.body.userSoftSkills,
                    userResume:req.body.userResume
                
            });  
            
            const savedApplication = await newApplication.save(); 
            res.json({ message: "Application submitted successfully", application: savedApplication });  


})




