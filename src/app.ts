import express, { type Application } from "express";
import cors from "cors";
import notFoundRoute from "./app/middlewares/notFoundRoute";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import path from "path";

const app: Application = express();

// parsers
app.use(
  cors({
    credentials: true,
  }),
);
app.use(express.json());

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
