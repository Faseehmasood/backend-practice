import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const ConnectionDatabase=async()=>{
    try {
      const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      console.log(`Mongoose DB Connected !! DB Host:${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Mongoose connection Failed",error)
        process.exit(1)
    }
}

export default ConnectionDatabase