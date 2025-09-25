import express from "express";
import {
    createPost,
    getPostsByCourse,
    addComment,
    getComments,
    deletePost,
} from "../controllers/forumController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // adjust path if needed

const forumRouter = express.Router();

// Forum routes
forumRouter.post("/posts", authMiddleware, createPost); // Create a new post
forumRouter.get("/courses/:courseId/posts", authMiddleware, getPostsByCourse); // Get all posts in a course
forumRouter.post("/posts/:postId/comments", authMiddleware, addComment); // Add comment to a post
forumRouter.get("/posts/:postId/comments", authMiddleware, getComments); // Get comments of a post
forumRouter.delete("/posts/:postId", authMiddleware, deletePost); // Delete a post

export default forumRouter;