import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import { router } from "./Routes/Auth.routes.js";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));


app.use(cookieParser());

app.use('/api/users', router);

export {app}