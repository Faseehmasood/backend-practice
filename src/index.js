import dotenv from "dotenv"
import ConnectionDatabase from "./db/index.js";

dotenv.config({
    path:'./.env'
})

ConnectionDatabase()