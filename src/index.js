import dotenv from "dotenv"
import ConnectionDatabase from "./db/index.js";

dotenv.config({
    path:'./.env'
})


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