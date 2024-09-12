import { config } from "dotenv"
import path from "path"
config({ path: path.resolve("config/.env") })

import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: "dulbtdvey", 
    api_key: "769379426428985",
    api_secret: "_7grvULwFGiEcPeces0hfJJLL3Y",
    secure: true
})
export default cloudinary
