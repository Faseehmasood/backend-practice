import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 1. Check if Env variables are reaching this file
console.log("Cloud Name Check:", process.env.CLOUDINARY_CLOUD_NAME);

const uploadonCloudinary = async (localpath) => {
    try {
        if (!localpath) return null;

        // 2. Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localpath, {
            resource_type: "auto"
        });


        // 3. Upload ke baad local file delete karna (Standard Practice)
        if (fs.existsSync(localpath)) {
            fs.unlinkSync(localpath);
        }

        return response;

    } catch (error) {
        // 4. AGAR UPLOAD FAIL HUA TO ASLI ERROR YAHAN DIKHEGA
        console.log("CLOUDINARY UPLOAD ERROR DETAILED:", error);

        // Error aane par bhi local file delete karein taake temp folder clean rahe
        if (fs.existsSync(localpath)) {
            fs.unlinkSync(localpath);
        }

        return null;
    }
};

export { uploadonCloudinary };