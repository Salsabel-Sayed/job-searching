import { model, Schema } from "mongoose";




const companySchema = new Schema({
    companyName:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    industry:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        required:true,
    },
    companyEmail:{
        type:String,
        unique:true
    },
    companyHRRef:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
})


export const Company = model('Company',companySchema)