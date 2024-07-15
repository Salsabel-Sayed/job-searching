import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';



export const fileUploading= (fieldName)=>{

    
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '-' + file.originalname)
    }
  })

function fileFilter(req,res,cb){
    console.log(file);
    if(file.mimetype.startWith('PDF')){
        cb(null,true)
    }else{
        cb(error , false)
    }
  }
const upload = multer({storage,fileFilter})

return upload.single(fieldName)
}