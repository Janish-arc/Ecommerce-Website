import app from "./app.js";
import dotenv from 'dotenv'
import { connectiondb } from "./config/db.js"
import {v2 as cloudinary} from "cloudinary"

dotenv.config({path: 'backend/config/config.env'})
const PORT = process.env.PORT || 3000

connectiondb()

     // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
    });

process.on("uncaughtException", (err) => {
    console.log(`Error : ${err.message}`)
    console.log('Server is shutting down, due to uncaught exception')
process.exit(1)
})
// console.log(name)
const server = app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`)
})
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`)
    console.log(`Server is shutting down, due to unhandled rejection`)
server.close(() => {
    process.exit(1)
})
})
