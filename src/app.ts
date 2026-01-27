import express, { type Application } from "express";
import cors from "cors";
import notFoundRoute from "./app/middlewares/notFoundRoute";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import path from "path";
import cookieParser from 'cookie-parser';


const app: Application = express();

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);

    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:4000",
      "https://farmsellr.com"
    ];

    if (allowedOrigins.includes(origin)) return cb(null, origin);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.options(/.*/, cors());


app.use(express.json());
// Cookie parser middleware
app.use(cookieParser());


// routes
app.use("/api/v1", router);

// ===============================
// FRONTEND SERVE
// ===============================

// frontend folder path
const frontendPath = path.join(process.cwd(), "frontend");

// static files
app.use(express.static(frontendPath));

// test route
app.get("/welcome", (req, res) => {
  res.send("Welcome to our server!");
});

// IMPORTANT: frontend serve
app.get(/^\/(?!api\/v1).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
}); 

// run node cron jobs (dorkar nai shared hosting e kaj korbe na)
// startProfitCron(); 


app.use(globalErrorHandler);

app.use(notFoundRoute);

export default app;
