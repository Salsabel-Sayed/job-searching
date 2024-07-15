import joi from "joi";



const signUpVal = joi.object({
    firstName: joi.string().min(2).max(20).required(),
    lastName: joi.string().min(2).max(20).required(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: joi.string().pattern(/^[A-Za-z0-9]{2,10}$/).required(),
    DOB:joi.date().max('now').iso().required(),
    mobileNumber:joi.string().pattern(/^0(11|12|15|10)\d{8}$/).required(),
})

const signInVal = joi.object({
    email: joi.string().email({ minDomainSegments: 3, tlds: { allow: ['com', 'net', 'yahoo'] } }).required(),
    password: joi.string().pattern(/^[A-Za-z0-9]{2,10}$/).required(),
})

export{
    signUpVal,
    signInVal
}


