import { appError } from "../../middleWare/handleErrors/appError.js";
import { catchError } from "../../middleWare/handleErrors/catchError.js";

import { Job } from "../jobs/job.model.js";
import { Company } from "./company.model.js";



// * add company
export const addCompany = catchError(async(req,res,next)=>{
    const company = await Company.insertMany(req.body)
    if(!company) return next(new appError("campany not found",400))
        res.status(200).json({message:"added",company})
})

// ? ////////////////////////////////////////////////////////////////////////////////////
// * Update company data

export const updateCompany = catchError(async(req,res,next)=>{
    const company = await Company.findById(req.params.id).populate("companyHRRef", 'role')

    if(!company) return next(new appError("campany not found",400))
        if(company.companyHRRef.role === "Company_HR"){
            const updateWithRole = await Company.findByIdAndUpdate(req.params.id , req.body ,{ new: true })
            res.json({message:"updated",updateWithRole})
        }else{
            next(new appError("the editor not HR company", 400))
        }
        
}
)
// ? ////////////////////////////////////////////////////////////////////////////////////
// * delete company data

export const deleteCompany = catchError(async(req,res,next)=>{
    const company = await Company.findByIdAndDelete(req.params.id,req.body,{new:true}).populate("companyHRRef", 'role')

    if(!company) return next(new appError("campany not found",400))
        if(company.companyHRRef.role === "Company_HR"){
            res.json({message:"deleted",company})
        }else{
            next(new appError("the editor not HR company", 400))
        }
}
)

// ? ////////////////////////////////////////////////////////////////////////////////////
// * get company data

export const getCompany = catchError(async(req,res,next)=>{
    const company = await Company.findById(req.params.id)
    const jobData = await Job.find({addedBy:req.params.id}).populate("addedBy","companyHRRef")

    if(!company) return next(new appError("campany not found",400))
        res.json({message:"get",company,jobData})

}
)
// ? ////////////////////////////////////////////////////////////////////////////////////
// * search for a company with a name 
export const searchName = catchError(async(req,res,next)=>{
    const company = await Company.findOne({companyName:req.query.companyName}).populate("companyHRRef", 'role')
    if(!company) next(new appError("company not found",404))
        if(company.companyHRRef.role === "Company_HR" || "User") {
            res.json({message :"searching...", company})
        }else{
            next(new appError("the editor not HR company", 400))
        }
})




