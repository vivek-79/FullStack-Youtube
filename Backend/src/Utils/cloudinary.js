import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import {apiError} from './apiError.js'

const cloudnaryUpload =async(localFilePath)=>{
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET
    });

    try {
        if(!localFilePath) return null
        const upload = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        if(!upload) throw new apiError(502,"Error While Uploading Image")
        fs.unlinkSync(localFilePath)
        console.log('File Uploaded On Cloudinary',upload.url)
        return upload.url
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

export {cloudnaryUpload}