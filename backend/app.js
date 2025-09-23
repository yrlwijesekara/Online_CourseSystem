// app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes.js";
//import { errorHandler } from "src/middleware/errorHandler.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", routes);
//app.use(errorHandler);

export default app;