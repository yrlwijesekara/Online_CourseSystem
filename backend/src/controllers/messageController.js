import { PrismaClient } from '@prisma/client';
import {roleCheck} from "../middleware/roleCheck.js";

const prisma = new PrismaClient();

// Utility to check if the user can message the target
const canMessage = (senderRole, receiverRole) => {
    if (senderRole === 'STUDENT' && receiverRole === 'INSTRUCTOR') return true;
    if (senderRole === 'INSTRUCTOR' && ['STUDENT', 'ADMIN'].includes(receiverRole)) return true;
    if (senderRole === 'ADMIN') return true; // admin can message anyone
    return false;
};

// Create a message
export const createMessage = async (req, res) => {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    try {
        const receiver = await prisma.user.findUnique({ where: { id: Number(receiverId) } });
        if (!receiver) return res.status(404).json({ error: 'Receiver not found' });

        if (!canMessage(req.user.role, receiver.role)) {
            console.log("Sender role:", req.user.role, "Receiver role:", receiver.role);
            return res.status(403).json({ error: 'Not allowed to message this user' });
        }

        const message = await prisma.message.create({
            data: {
                senderId,
                receiverId: Number(receiverId),
                content,
                read: false, // mark as unread initially
            }
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create message' });
    }
};

// Get messages with pagination
export const getMessages = async (req, res) => {
    const { otherUserId } = req.params;
    const userId = req.user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { AND: [{ senderId: userId }, { receiverId: Number(otherUserId) }] },
                    { AND: [{ senderId: Number(otherUserId) }, { receiverId: userId }] }
                ]
            },
            orderBy: { createdAt: 'asc' },
            skip,
            take: limit,
            include: {
                sender: { select: { id: true, name: true, role: true } },
                receiver: { select: { id: true, name: true, role: true } }
            }
        });

        // Mark unread messages as read
        
        const result = await prisma.message.updateMany({
            where: { senderId: Number(otherUserId), receiverId: userId, read: false },
            data: { read: true }
        });
        console.log("Updated count:", result.count);

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

// Delete a message
export const deleteMessage = async (req, res) => {
    const { messageId } = req.params;

    try {
        const message = await prisma.message.findUnique({ where: { id: Number(messageId) } });
        if (!message) return res.status(404).json({ error: 'Message not found' });

        if (req.user.id !== message.senderId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Not allowed to delete this message' });
        }

        await prisma.message.delete({ where: { id: Number(messageId) } });
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
};

// Get unique conversations with last message preview
export const getConversations = async (req, res) => {
    const userId = req.user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    try {
        const messages = await prisma.message.findMany({
            where: { OR: [{ senderId: userId }, { receiverId: userId }] },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: { select: { id: true, name: true, role: true } },
                receiver: { select: { id: true, name: true, role: true } }
            }
        });

        const conversationMap = new Map();
        messages.forEach(msg => {
            const [id1, id2] = [msg.senderId, msg.receiverId].sort((a, b) => a - b);
            const key = `${id1}_${id2}`;
            if (!conversationMap.has(key)) conversationMap.set(key, msg);
        });

        const conversations = Array.from(conversationMap.values()).slice(skip, skip + limit);
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
};