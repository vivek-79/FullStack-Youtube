
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async()=>{
    try {
        const connect =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        if(connect){
            console.log("Connected")
        }
    } catch (error) {
        console.log("Database Connection Failed",error.message)
    }

}

export default connectDb