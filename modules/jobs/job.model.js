import { model, Schema, Types } from "mongoose";



const jobSchema = new Schema({
    jobTitle:{
        type:String,
        required:true
    },
    jobLocation:{
        type:String,
        enum:['onsite','remotely','hybrid'],
        required:true      
    },
    workingTime:{
        type:String,
        enum:['part-time' , 'full-time'],
        required:true
    },
    seniorityLevel:{
        type:String,
        enum:['Junior', 'Mid-Level', 'Senior,Team-Lead', 'CTO' ],
        required:true
    },
    jobDescription:{
        type:String,
        required:true
    },
    technicalSkills:[{
        type:String,
    }],
    softSkills:[{
        type:String,
    }],
    addedBy:{
        type:Types.ObjectId,
        ref:'User'
    },
    userResume:String,
    avgRate: {
        type: Number,
        default: 0,
    },
    rateNo: {
        type: Number,
        default: 0,
    },
    likes: [{
        type: Types.ObjectId,
        ref: "User",
    }],
    reviewer: [{
        type: Types.ObjectId,
        ref: "User",
    }],
    likesNo: {
        type: Number,
        default: 0,
    }

})


export const  Job = model('Job',jobSchema)