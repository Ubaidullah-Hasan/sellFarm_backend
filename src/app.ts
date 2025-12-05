import express, { type Application } from "express";
import cors from "cors";

const app: Application = express();

// parsers
app.use(cors());
app.use(express.json());

// test route

app.get("/", (req, res) => {
  res.send("Welcome to our server!");
});

export default app;
