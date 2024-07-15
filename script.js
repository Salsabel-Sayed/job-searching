process.on('uncaughtException', (err)=>{
    console.log('error in code',err);
})

import express from 'express'
import {dbConnection} from "./dataBase/dbConnection.js"
import { fileUploading } from './modules/uploads/upload.File.js'
import { appError } from './middleWare/handleErrors/appError.js'
import { globalError } from './middleWare/handleErrors/globalError.js'
import userRoutes from './modules/users/user.routes.js'
import companyRoutes from "./modules/companies/copmany.routes.js"
import jobRouter from './modules/jobs/job.routes.js';
import applicationsRoutes from './modules/applications/application.routes.js';

const app = express()
const port = 3000

app.use(express.json())
app.use('/users',userRoutes)
app.use('/companies',companyRoutes)
app.use('/jobs',jobRouter)
app.use('/applications',applicationsRoutes)

app.use('/uploads',express.static('uploads'))

// app.post('/upPdf',fileUploading('file'),async(req,res,next)=>{
//     console.log("upload files", req.file);
//     console.log("upload body", req.body);

//     req.body.userResume = req.file.filename 

//     await file.insertMany(req.body)
//     res.json({message:"added"})

// })

// app.get('/file',async(req,res)=>{
//     let fileUp = await file.find()
    
//     res.json({message:"done url",fileUp})
// })

// app.get('/verify/:email',async(req,res)=>{
//     await User.findOneAndUpdate({email:req.params.email},{ recoveryEmail:"true"})
//      res.json({message:"done",email:req.params.email})
// })

app.use('*',(req,res,next)=>{
    next(new appError(`route not found ${req.originalUrl}`, 404))
})

app.use(globalError)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))