import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./Routes/Auth.routes.js";
import routerC from "./Routes/Charger.routes.js";

const app = express();

const allowedOrigins = [
  "https://charging-station-full-stack-fw8du0uc8-suyash-pathak04s-projects.vercel.app",
  "https://charging-station-full-stack.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true 
}));

/*app.options('*', cors({
  origin: 'https://charging-station-full-stack.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));*/

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());

app.use('/api/users', router);
app.use('/api/chargers', routerC);

{app.get('/api/users',(req,res)=>[
    res.send("Welcome to api ")
]) }
export { app };

