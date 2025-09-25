import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

class AuthController {
    async register(req, res) {
        try {
            const {email, password, name} = req.body;

            const existingUser = await prisma.user.findUnique({
                where: {email},
            });

            if (existingUser) {
                return res.status(400).json({message: 'User already exists'});
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });

            const token = jwt.sign(
                {userId: user.id, role: user.role},
                process.env.JWT_SECRET || 'default-secret',
                {expiresIn: '24h'}
            );

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            });
        } catch (error) {
            res.status(500).json({message: 'Error registering user', error});
        }
    }

    async login(req, res) {
        try {
            const {email, password} = req.body;

            const user = await prisma.user.findUnique({
                where: {email},
            });

            if (!user) {
                return res.status(401).json({message: 'Invalid credentials'});
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({message: 'Invalid credentials'});
            }

            const token = jwt.sign(
                {userId: user.id, role: user.role},
                process.env.JWT_SECRET || 'default-secret',
                {expiresIn: '24h'}
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            });
        } catch (error) {
            res.status(500).json({message: 'Error logging in', error});
        }
    }

    async verifyToken(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({message: 'No token provided'});
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({message: 'Invalid token'});
        }
    }
}

export default new AuthController();