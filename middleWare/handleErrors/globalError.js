export const globalError = (err, req,res,next)=>{
    let code = err.statusCode || 500
    res.status(code).json({error: "middleware error", message: err.message, code :code , stack: err.stack})
}