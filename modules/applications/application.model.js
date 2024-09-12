import { model, Schema, Types } from "mongoose";

const applicationSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Job",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  technicalSkills: [
    {
      type: String,
    },
  ],
  softSkills: [
    {
      type: String,
    },
  ],
  userResume: {
    type: Object,
  },
 
});

// applicationSchema.post('init',function(doc){
//         doc.imgUrl = "url" + val.imgUrl
//         console.log("val", val.imgUrl = "url" + doc.imgUrl);
// })

export const Application = model("Application", applicationSchema);
