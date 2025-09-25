import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async (req, res) => {
    try {
        const {email, password, name, bio, role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                bio,
                role
            }
        });

        const {password: _, ...userWithoutPassword} = user;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(400).json({error: 'Unable to create user'});
    }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await prisma.user.findUnique({where: {email}});

        if (!user) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const token = jwt.sign(
            {userId: user.id, role: user.role},
            process.env.JWT_SECRET || 'fallbacksecret',
            {expiresIn: '24h'}
        );

        // Return both token and user data (without password)
        const {password: _, ...userWithoutPassword} = user;
        res.json({
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(400).json({error: 'Login failed'});
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = parseInt(req.userId);
        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {
                id: true,
                email: true,
                name: true,
                bio: true,
                avatarUrl: true,
                role: true
            }
        });

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({error: 'Unable to fetch profile'});
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = parseInt(req.userId);
        const {name, bio, avatarUrl} = req.body;

        const user = await prisma.user.update({
            where: {id: userId},
            data: {
                name,
                bio,
                avatarUrl
            },
            select: {
                id: true,
                email: true,
                name: true,
                bio: true,
                avatarUrl: true,
                role: true
            }
        });

        res.json(user);
    } catch (error) {
        res.status(400).json({error: 'Unable to update profile'});
    }
};

export const deleteProfile = async (req, res) => {
    try {
        const userId = req.userId;

        await prisma.user.delete({
            where: {id: userId}
        });

        res.status(200).json({message: 'Profile deleted successfully'});
    } catch (error) {
        res.status(400).json({error: 'Unable to delete profile'});
    }
};

