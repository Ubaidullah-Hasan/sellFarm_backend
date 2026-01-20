import express, { type Application } from "express";
import cors from "cors";
import notFoundRoute from "./app/middlewares/notFoundRoute";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import path from "path";
import cookieParser from 'cookie-parser';


const app: Application = express();

// parsers
// app.use(
//   cors({
//     origin: "http://localhost:5173", // 👈 frontend origin
//     credentials: true,
//   })
// );

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // postman / server-to-server
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


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

// IMPORTANT: frontend fallback
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(globalErrorHandler);

app.use(notFoundRoute);

export default app;
