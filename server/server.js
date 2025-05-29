import { app } from "./app.js";
import dotenv from "dotenv"
import { connectDB } from "./DB/Db.js";

dotenv.config()
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at Port ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MongoDB connection failed !!",error);
})