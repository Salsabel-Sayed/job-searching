import nodemailer from "nodemailer"
import { emailHtml } from "./htmlEmail.js";
import { catchError } from "../handleErrors/catchError.js";
 

// Create a Nodemailer transporter  
const transporter = nodemailer.createTransport({  
  service: 'Gmail',  
  auth: {  
      user: 'slsabilkamal99@gmail.com',  
      pass: 'eaturfmwwvatolej'  
  }  
});  

// Function to send OTP via email  
export function sendOTPByMail(email, otp) {  
  const mailOptions = {  
      from: '"Your Name" <slsabilkamal99@gmail.com>',  
      to: email,  
      subject: 'Your OTP Code',  
      text: `Your OTP code is: ${otp}`  
  };  

  transporter.sendMail(mailOptions, function(error, info) {  
      if (error) {  
          console.log(error);  
      } else {  
          console.log('Email sent: ' + info.response);  
      }  
  });  
}  







// export const sendEmails = catchError(async(email)=>{
//   const transporter = nodemailer.createTransport({
//       service:"gmail",
//       auth: {
//         user: "slsabilkamal99@gmail.com",
//         pass: "eaturfmwwvatolej",
//       },
//     });

//     const info = await transporter.sendMail({
//       from:'"salsabeel test" <slsabilkamal99@gmail.com>',
//       to :email,
//       subject: "please help us to verify ur email",
//       html:emailHtml(email)
//     })
//     console.log("msg sent", info.messageId);

// })