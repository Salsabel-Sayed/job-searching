import { appError } from "../../middleWare/handleErrors/appError.js";
import { catchError } from "../../middleWare/handleErrors/catchError.js";
import { Job } from "./job.model.js";
import { Application } from "./../applications/application.model.js";
import { Company } from "../companies/company.model.js";

import cloudinary from "../../utils/cloudinary.js";

import ExcelJS from "exceljs"
import { ApiFeatures } from "../../utils/apiFeature.js";



// * add job
export const addjob = catchError(async (req, res, next) => {
  req.body.addedBy = req.user.id
  const job = await Job.create(req.body);
  if (!job) return next(new appError("campany not found", 400));
  res.status(200).json({ message: "added", job });
});

// ? ////////////////////////////////////////////////////////////////////////////////////
// * Update job data

export const updatejob = catchError(async (req, res, next) => {
  const hrId = req.user.id
  console.log("hrId", hrId);
  
  const job = await Job.findOne({jobTitle:req.body.jobTitle},{hrId}).populate("addedBy", "role");
  console.log("job", job.addedBy.id);
  

  if (!job) return next(new appError("campany not found", 400));
  if (job.addedBy.role !== "Company_HR") return next(new appError("u r not company woner"))
     if(job.addedBy.id !== hrId ) return next(new appError("id didnt match with woner id",404))
    if(job.addedBy.id === hrId ){
      const updateWithRole = await Job.updateOne({_id:job.id},req.body);
    res.json({ message: "updated", updateWithRole });
    }
});
// ? ////////////////////////////////////////////////////////////////////////////////////
// * delete job data


export const deletejob = catchError(async (req, res, next) => {
  const hrId = req.user.id

  const job = await Job.findOne({ jobTitle: req.body.jobTitle }, { hrId }).populate("addedBy", "role");

  if (!job) return next(new appError("campany not found", 400));
  if (job.addedBy.role !== "Company_HR") return next(new appError("u r not company woner"))
  if (job.addedBy.id !== hrId) return next(new appError("id didnt match with woner id", 404))
  if (job.addedBy.id === hrId) {
    const updateWithRole = await Job.deleteOne({ _id: job.id });
    res.json({ message: "updated", updateWithRole });
  }
});
// ? ////////////////////////////////////////////////////////////////////////////////////
// * Get all Jobs with their company’s information.


export const getAllJobs = async (req, res, next) => {
  try {
 
    const jobs = await Job.find().populate('addedBy', 'email'); 
    
    
     

    if (!jobs || jobs.length === 0) {
      return next(new appError("No jobs found!", 404));
    }

    const results = jobs.map(job => {
      const objJob = job.toObject();  
      objJob.company = job.addedBy;   
      return objJob;
    });

    return res.status(200).json({ message: "Done!", results });
  } catch (error) {
    return next(new appError("Internal server error", 500)); // Catch any errors  
  }
};

// ? ////////////////////////////////////////////////////////////////////////////////////
// * Get all Jobs for a specific company
export const getSpecificJob = async (req, res, next) => {
  const companies = await Company.find({companyName:req.query.companyName});
  console.log("company", companies);
  
  if (!companies) {
    return next(new appError("no companies found",404))
  }
  const companyIds = companies.map(company => company.companyHRRef); 
  console.log("companyIds", companyIds);
  
  const jobs = await Job.find({ addedBy:  companyIds  });
  console.log("jobs",jobs);
  
  return res.json({ message: "Done!",companies, jobs });
};

// ? ////////////////////////////////////////////////////////////////////////////////////
// * Get all Jobs that match the following filters with jobTitle and jobLocation

export const getAlljobWithFilter = catchError(async (req,res,next) =>{
    let apiFeatures = new ApiFeatures(Job.find(), req.query).filter()
    let jobfilter = await apiFeatures.dbQuery
    console.log("jobfilter",jobfilter);
    
    jobfilter || next(new appError('subCategory not found', 404))
    !jobfilter || res.json({ message: "get all", searching: apiFeatures.searchQuery, jobfilter })
})

// ? ////////////////////////////////////////////////////////////////////////////////////
// * Apply to Job

// export const applyToJob = catchError(async (req, res, next) => {
//   const jobData = await Job.findById(req.params.id).populate("addedBy", "role");
//   if (!jobData) return next(new appError("job not found", 400));

//   if (!jobData) return next(new appError("job not found", 401));
//   if (jobData.addedBy.role !== "User")
//     return next(new appError("the editor not user", 400));

//   const newApplication = new Application({
//     jobId: req.body.jobId,
//     userId: req.body.userId,
//     userTechSkills: req.body.userTechSkills,
//     userSoftSkills: req.body.userSoftSkills,
//     userResume: req.body.userResume,
//   });

//   const savedApplication = await newApplication.save();
//   res.json({
//     message: "Application submitted successfully",
//     application: savedApplication,
//   });
// });

export const applyToJob = catchError(async (req, res, next) => {
  const { softSkills, technicalSkills, jobId } = req.body;
  console.log("skills", softSkills, technicalSkills, jobId);

  const userId = req.user.id; // ensure req.user is defined and contains id  
  console.log("userId", userId);

  const job = await Job.findById(jobId); // Find the job without wrapping jobId in an object  
  console.log("job", job);

  if (!job) {
    return next(new appError("This job does not exist", 404));
  }

  const isExist = await Application.findOne({ userId, jobId });
  console.log("isExist", isExist);

  if (isExist) {
    return next(new appError("You already applied for this job", 400));
  }

  console.log("Uploaded File:", req.file);

  if (!req.file) {
    return next(new appError("No file uploaded", 400));
  }

  const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
    folder: "applications/userResume",
  }).catch((err) => {
    console.log("Cloudinary upload error:", err); // Better logging  
    return null;
  });

  if (!uploadResponse) {
    return next(new appError("File upload failed", 500));
  }

  const { secure_url, public_id } = uploadResponse;

  const application = await Application.create({
    softSkills,
    technicalSkills,
    userResume: { secure_url, public_id },
    userId,
    jobId,
  });
  console.log("application", application);

  return res.status(201).json({ message: "Application submitted successfully", application });
});
// ? ////////////////////////////////////////////////////////////////////////////////////
//  excel sheet

export const excelSheet = catchError(async (req, res, next) => {
  const company = await Company.findOne({ companyId:req.params.companyId });
  console.log("company", company);

  const jobs = await Job.find({ addedBy: company.companyHRRef });
  console.log("jobs",jobs);
  

  var applications = [];
  for (let job of jobs) {
    var application = await Application.find({ jobId: job._id }).populate("userId jobId");
    applications.push(application);
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("jobs");

  worksheet.columns = [
    { header: "user name", key: "user", width: 20 },
    { header: "resume link", key: "resume", width: 100 },
    { header: "job applied to", key: "job", width: 20 },
  ];

  var data = [];
  for (const inApplication of applications) {
    for (const application of inApplication) {
      var dataEntry = {
        user: application.userId.username,
        resume: application.userResume.secure_url,
        job: application.jobId.jobTitle,
      };
      data.push(dataEntry);
    }
  }

  worksheet.addRows(data);
  await workbook.xlsx.writeFile("bonus.xlsx").catch((error) => {
    console.log(error);
  });

  return res.json(applications);
})
// ? ////////////////////////////////////////////////////////////////////////////////////
// ? ////////////////////////////////////////////////////////////////////////////////////
// *get all applications for specific job

export const getAllAppSpecific = catchError(async (req, res, next) => {

  const userId = req.user.id
  console.log("userId", userId);


  // const applicationsJob = await Application.find({ job: jobId })
  const job = await Job.findOne({ _id: req.params.id }).populate("addedBy")
  console.log("job", job.addedBy.id);
  if (!job) {
    return next(new appError("Job not found", 404));
  }
  if (job.addedBy.id === userId) {
    if (job.addedBy.role !== "Company_HR") return next(new appError("user not allowed", 404))

    const applications = await Application.find({ jobId: job._id }).populate('userId');
    console.log("applications", applications);
    const filteredAppsUser = applications.filter(app => app.userId._id.toString() === userId);
    console.log("filteredAppsUser", filteredAppsUser);

    // If there are applications that match, send them in the response  
    if (filteredAppsUser.length === 0) {
      return res.json({ message: "No applications found for the user", applications: [] });
    }
    // Map through filtered applications to include only the relevant user information  
    const responseAppsUser = filteredAppsUser.map(app => ({
      ...app._doc,
      userId: app.userId._id,
      role: app.userId.role,

    }));

    return res.json({ message: "Applications retrieved successfully", applications: responseAppsUser });
  } else {
    return next(new appError("User not allowed", 403)); // Permission denial  
  }
})


// ? ////////////////////////////////////////////////////////////////////////////////////
//* like and unlike



export const likeOrUnlike = catchError(async (req, res, next) => {
  const jobId = req.params.id
  const userId = req.user.id

  const jobs = await Job.find({ _id: jobId })

  if (!jobs) {
    return next(new appError("no jobs found!",404))
  }
  const findLike = await Job.findOne({ likes: userId })

  if (findLike) {
    await Job.findByIdAndUpdate(jobId, {
      $pull: { likes: userId },
      $inc: { likesNo: -1 }
    })
  } else {
    await Job.findByIdAndUpdate(jobId, {
      $push: { likes: userId },
      $inc: { likesNo: +1 }
    })
  }

  return findLike ? res.json("unliked jobs") : res.json("liked jobs")
}
)

// ? ////////////////////////////////////////////////////////////////////////////////////
// rating avg

export const rateJob = async (req, res, next) => {
  const { rating } = req.body;
  const jobId = req.params.id;
  const userId = req.user.id;
  const job = await Job.findById(jobId); 
  for (const reviewer of job.reviewer) {
    if (JSON.stringify(userId) === JSON.stringify(reviewer)) {
      return res.json("you already reviewed this job");
    }
  }
  const newAvg =
    ((job.avgRate * job.rateNo )+ parseInt(rating)) /(job.rateNo + 1);
  job.avgRate = newAvg;
  job.rateNo = job.rateNo + 1;
  job.reviewer.push(userId);
  await job.save();
  return res.json({
    message: `Done! you gave this job a rating of: ${rating}!`,
  });
};

// ? ////////////////////////////////////////////////////////////////////////////////////
// pagination , filter , search, sort and select
export const pagination = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Job.find(), req.query).pagination().fields().filter().search().sort()
  let jobs = await apiFeatures.dbQuery
  jobs || next(new appError('category not found', 404))
  !jobs || res.json({ message: "get all", searching: apiFeatures.searchQuery, jobs })
})




