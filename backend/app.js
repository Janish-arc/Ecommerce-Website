import express from "express"
import router from "./routes/productRoutes.js" 
import Error from "./middleware/errormw.js"
import user from "./routes/userRoutes.js"
import cookieParser from "cookie-parser"
import order from "./routes/orderRoutes.js"
import fileUpload from "express-fileupload"
import cart from "./routes/cartRoutes.js"
import cors from "cors"
import category from "./routes/categoryRoutes.js"

const app = express()
app.use(cors({
  origin: ["http://localhost:5173","https://ecommerce-website-uwpk.vercel.app"],
  credentials: true
}))
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser())
app.use(fileUpload({
  limits: { fileSize: 1 * 1024 * 1024 } // 1MB
}))

app.use("/api/v1", router)
app.use("/api/v1", user)
app.use("/api/v1", order)
app.use("/api/v1", cart)
app.use("/api/v1", category)
app.use(Error)

export default app


