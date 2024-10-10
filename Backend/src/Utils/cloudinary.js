import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import {apiError} from './apiError.js'
import { error } from 'console';

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
        return upload
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}
const cloudnaryDelete =async(publicId)=>{
    console.log(publicId)
    try {
        if(!publicId) return null
         await cloudinary.uploader.destroy(publicId,(error,result)=>{
            console.log(result,error)
        })
    } catch (error) {
        return null
    }
}

export {cloudnaryUpload,cloudnaryDelete}