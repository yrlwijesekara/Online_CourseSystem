import express from 'express';
import {register, login, deleteProfile, getProfile, updateProfile} from "../controllers/userController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get('/profile',authMiddleware, getProfile);
userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.delete('/profile', authMiddleware, deleteProfile);
userRouter.put('/profile', authMiddleware,  updateProfile);

export default userRouter;