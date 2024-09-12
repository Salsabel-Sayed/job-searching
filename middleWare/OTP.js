// import { User } from "../modules/users/user.model.js";

// // Middleware to authenticate OTP  
// export const authenticateOTP = (req, res, next) => {  
//     const { phone, enteredOTP } = req.body;  

//     User.findOne({ id: req.params.id })  
//         .then(user => {  
//             if (!user) {  
//                 return res.status(400).json({ message: 'User not found' });  
//             }  

//             if (user.otp !== enteredOTP) {  
//                 return res.status(400).json({ message: 'Invalid OTP' });  
//             }  

//             // If OTP is valid, you can perform further actions here  
//             next();  
//         })  
//         .catch(error => {  
//             res.status(500).json({ message: 'Error authenticating OTP' });  
//         });  
// };  

