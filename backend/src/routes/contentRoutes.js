import express from "express";
import { uploadContent, upload } from "../controllers/contentController.js";
const contentRouter = express.Router();

// Multiple file upload
contentRouter.post("/upload", upload.array("files", 10), uploadContent);

export default contentRouter;