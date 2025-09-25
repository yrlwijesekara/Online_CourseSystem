// app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes.js";
//import { errorHandler } from "src/middleware/errorHandler.js";

const app = express();

app.use(cors({ 
  origin: [
    "http://localhost:3000", 
    "http://localhost:3001", 
    "http://localhost:5173", // Vite default port
    "http://localhost:5174", // Alternative Vite port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000"
  ],
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", routes);
//app.use(errorHandler);

export default app;