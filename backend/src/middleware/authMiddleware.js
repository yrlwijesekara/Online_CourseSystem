import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallbacksecret");

        // Fetch user from DB to get full data including role
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user; // 👈 now controllers can do req.user.id / req.user.role
        next();
    } catch (err) {
        console.error("Auth error:", err);
        res.status(401).json({ error: "Invalid token" });
    }
};