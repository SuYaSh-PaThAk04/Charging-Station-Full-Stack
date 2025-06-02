import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import { router } from "./Routes/Auth.routes.js";
import routerC from "./Routes/Charger.routes.js";
const app = express()

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));


app.use(cookieParser());

app.use('/api/users', router);
app.use('/api/chargers',routerC);
app.get('/api/users',(req,res)=>[
    res.send("Welcome to api ")
])
export {app}
