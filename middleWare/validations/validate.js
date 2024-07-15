


export const validate = (userSchema)=>{
    return (req,res,next)=>{
        let {error} =userSchema.validate({...req.body, ...req.params,...req.query} ,{abortEarly: false})
        if(error){
            next()
        }else{
           let errMsg = error.details.map(err =>{err.message})
           res.json(errMsg)
        }
    }
}