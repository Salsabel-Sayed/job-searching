import { model, Schema } from "mongoose";


const applicationSchema = new Schema({
    jobId:{
        type:Schema.Types.ObjectId,
        ref:"Job"
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    userTechSkills:[{
        type:String,

    }],
    userSoftSkills:[{
        type:String,
    }],
    userResume:{
        type:String, 
    }
})


// applicationSchema.post('init',function(doc){
//         doc.imgUrl = "url" + val.imgUrl
//         console.log("val", val.imgUrl = "url" + doc.imgUrl);
// })

export const Application = model('Application', applicationSchema)