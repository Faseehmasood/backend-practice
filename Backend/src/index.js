import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})
import ConnectionDatabase from "./db/index.js";
import express from "express"
import { app } from "./app.js";

// const app=express()



ConnectionDatabase()
.then(()=>{
    app.on("error", (error) => {
        console.log("ERR: ", error);
        throw error;
    })

    const port=process.env.PORT || 8000;
    app.listen(port,()=>{
        console.log(`Server is Running ${port}`)
    })
    
})
.catch((error)=>{
    console.log("MONGO CONNECTION FAILED",error)

})