import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const uploadOnCloudinary = async (localPath) => {
    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    // resolve
    const exactPath = path.resolve(localPath);
    console.log("resolved path: ", exactPath);
    try {
        if (!exactPath) {
            return null;
        }
        // upload the file
        const res = await cloudinary.uploader.upload(exactPath, {
            resource_type: "auto"
        })
        fs.unlinkSync(exactPath)
        return res;
    } catch (err) {
        fs.unlinkSync(exactPath);
        return null
    }
}

export { uploadOnCloudinary }

