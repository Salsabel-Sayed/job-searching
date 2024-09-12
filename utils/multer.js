import multer from "multer";
import path from 'path';

// Define your file types  
export const filteration = {
    image: ["image/png", "image/jpeg", "image/gif", "image/jpg"],
    file: ["application/pdf", "application/msword"],
};

// Function to upload files  
export const uploadFile = (filter) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/'); // Adjust this to your desired directory  
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });
    

    const fileFilter = (req, file, cb) => {
        console.log("Multer File Received:", file);
        if (filter.includes(file.mimetype)) {
            cb(null, true); // Accept the file  
        } else {
            cb(new Error("Invalid file format"), false); // Reject the file  
        }
    };

    const upload = multer({ storage, fileFilter });

    return upload;
};
