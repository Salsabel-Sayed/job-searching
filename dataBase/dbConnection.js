import mongoose from "mongoose";



export const dbConnection = mongoose.connect('mongodb://localhost:27017/firstExam').then(()=>{
    console.log('connected successfully');
}).catch((error)=>{
    console.log('error in connection',error);
})