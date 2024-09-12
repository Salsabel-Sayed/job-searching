import joi from "joi";

export const companyAddingVal = joi.object({
    companyName: joi.string().min(2).max(20).required().custom(async (value, helpers) => {  
            const isUnique = await isUserNameUnique(value);  
            if (!isUnique) {  
                return helpers.error('any.custom', { message: 'Username must be unique' });  
            }  
            return value; // if it is unique, return the value  
        }), 
    description: joi.string().min(30).max(100).required(),
    industry: joi.string().required(),
    address: joi.string().required(),
    numberOfEmployees:joi.number().required(),
    companyEmail:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
})