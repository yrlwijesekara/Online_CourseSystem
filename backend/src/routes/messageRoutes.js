import express from 'express';
import { createMessage, getMessages, deleteMessage, getConversations } from '../controllers/messageController.js';
import {authMiddleware} from "../middleware/authMiddleware.js";
const messageRouter = express.Router();

// All routes require authentication
messageRouter.use(authMiddleware);

// Create a message
messageRouter.post('/', createMessage);

// Get messages between a logged-in user and another user, with pagination
messageRouter.get('/:otherUserId', getMessages);

// Delete a message
messageRouter.delete('/:messageId', deleteMessage);

// Get all conversations for logged-in user, with pagination
messageRouter.get('/', getConversations);

export default messageRouter;