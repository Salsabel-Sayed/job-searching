import { appError } from "../../middleWare/handleErrors/appError.js";
import { catchError } from "../../middleWare/handleErrors/catchError.js";

import { Job } from "../jobs/job.model.js";
import { User } from "../users/user.model.js";
import { Company } from "./company.model.js";

// * add company
export const addCompany = catchError(async (req, res, next) => {
  const findHR = await User.findById({_id:req.user.id})
  
  if(!findHR) return next(new appError("sorry! u r not found.",404))
    const company = req.body

    const existCompany = await Company.findOne({company},{companyHRRef:req.user.id})
    if(existCompany) return next(new appError("sorry! company already exist",404))
  if(findHR.role !== "Company_HR") return next(new appError("sorry! u r not company owner.",404))
  if(findHR && findHR.role === "Company_HR" && !existCompany){
    const newCompany = await Company.create({companyHRRef:req.user.id,...company})
  if (!newCompany) return next(new appError("campany not found", 400));
  res.status(200).json({ message: "added", newCompany });
  }
});

// ? ////////////////////////////////////////////////////////////////////////////////////
// * Update company data

// ? //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// * update comapny (only comapny can update)

export const updateCompany = catchError(async (req, res, next) => {
  const hrId = req.user.id;
  console.log("hrId", JSON.stringify(hrId));
  const findHR = await Company.findOne({companyEmail:req.body.companyEmail},{hrId}).populate("companyHRRef","_id")
   console.log("findHR", JSON.stringify(findHR.companyHRRef._id));

  if (JSON.stringify(findHR.companyHRRef._id) !== JSON.stringify(hrId)) {
    return next(new appError("another user info!!", 404));
  }
     if(JSON.stringify(findHR.companyHRRef._id) === JSON.stringify(hrId)){
       const updated = await Company.updateOne({ _id: findHR }, req.body);
      console.log("updated", updated);
      res.json({ message: "Done!", updated });
     }
});

// ? ////////////////////////////////////////////////////////////////////////////////////
// * delete company data

export const deleteCompany = catchError(async (req, res, next) => {
   const hrId = req.user.id;
  console.log("hrId", JSON.stringify(hrId));
  const findHR = await Company.findOne({companyEmail:req.body.companyEmail},{hrId}).populate("companyHRRef","_id")
   console.log("findHR", JSON.stringify(findHR.companyHRRef._id));

  if (JSON.stringify(findHR.companyHRRef._id) !== JSON.stringify(hrId)) {
    return next(new appError("another user info!!", 404));
  }

 if(JSON.stringify(findHR.companyHRRef._id) === JSON.stringify(hrId)){
       const deleted = await Company.deleteOne(findHR._id);

      res.json({ message: "Done!", deleted });
     }
});

// ? ////////////////////////////////////////////////////////////////////////////////////
// * get company data (return all jobs related to this company)

export const getCompany = catchError(async (req, res, next) => {
  const company = await Company.findById(req.params.id);
  const jobData = await Job.find({ addedBy: req.params.id }).populate(
    "addedBy",
    "companyHRRef"
  );

  if (!company) return next(new appError("campany not found", 400));
  res.json({ message: "get", company, jobData });
});

// ? ////////////////////////////////////////////////////////////////////////////////////
// * get company name
// export const getCompanyName = async (req,res,next) =>{
//     const {companyName} = req.params
//     const company = await companyModel.findOne({companyName:{$regex:companyName,$options:"i"}})
//     if(!company){
//         return res.json("no company found with that name")
//     }
//     return res.json(company)
// }
// // // ? ////////////////////////////////////////////////////////////////////////////////////
// * search for a company with a name
export const searchName = catchError(async (req, res, next) => {
  const company = await Company.findOne({
    companyName: req.query.companyName,
  }).populate("companyHRRef", "role");
  if (!company) next(new appError("company not found", 404));
  if (company.companyHRRef.role === "Company_HR" || "User") {
    res.json({ message: "searching...", company });
  } else {
    next(new appError("the editor not HR company", 400));
  }
});
