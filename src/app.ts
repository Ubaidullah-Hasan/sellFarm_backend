import express, { type Application } from "express";
import cors from "cors";
import notFoundRoute from "./app/middlewares/notFoundRoute";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

// parsers
app.use(cors());
app.use(express.json());

// routes 
app.use("/api/v1", router);

// test route
app.get("/", (req, res) => {
  res.send("Welcome to our server!");
});

app.use(globalErrorHandler);

app.use(notFoundRoute);

export default app;
