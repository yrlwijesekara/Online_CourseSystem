// controllers/forumController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new forum post
export const createPost = async (req, res) => {
    try {
        const { courseId, title, content } = req.body;
        const userId = req.user.id; // from auth middleware

        const post = await prisma.forumPost.create({
            data: {
                courseId,
                userId,
                title,
                content,
            },
        });

        res.json(post);
    } catch (err) {
        console.error("Error creating forum post:", err);
        res.status(500).json({ error: "Failed to create post" });
    }
};

// Get all posts for a course
export const getPostsByCourse = async (req, res) => {
    try {
        const courseId = Number(req.params.courseId);

        const posts = await prisma.forumPost.findMany({
            where: { courseId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        avatarUrl: true,
                        createdAt: true,
                        updatedAt: true,
                        email: true,
                        bio: true,
                    }
                },
                comments: true
            }
        });

        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};

// Add comment to a post
export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const comment = await prisma.forumComment.create({
            data: {
                postId: Number(postId),
                userId,
                content,
            },
        });

        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: "Failed to add comment" });
    }
};

// Get all comments for a post
export const getComments = async (req, res) => {
    try {
        const postId = Number(req.params.postId);

        const comments = await prisma.forumComment.findMany({
            where: { postId },
            include: { user: true },
        });

        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch comments" });
    }
};

// Delete post (only by owner or admin)
export const deletePost = async (req, res) => {
    try {
        const postId = Number(req.params.postId);
        const userId = req.user.id;
        const role = req.user.role;

        const post = await prisma.forumPost.findUnique({ where: { id: postId } });

        if (!post) return res.status(404).json({ error: "Post not found" });

        if (post.userId !== userId && role !== "ADMIN") {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await prisma.forumPost.delete({ where: { id: postId } });
        res.json({ message: "Post deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete post" });
    }
};