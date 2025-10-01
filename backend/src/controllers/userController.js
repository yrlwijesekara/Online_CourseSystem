import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export const register = async (req, res) => {
  try {
    const { email, password, name, bio, role } = req.body

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        bio,
        role,
      },
    })

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "fallbacksecret", {
      expiresIn: "24h",
    })

    const { password: _, ...userWithoutPassword } = user
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(400).json({ message: "Unable to create user", error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "fallbacksecret", {
      expiresIn: "24h",
    })

    const { password: _, ...userWithoutPassword } = user
    res.json({
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    res.status(400).json({ error: "Login failed" })
  }
}

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        role: true,
        courses: { select: { id: true, title: true } }, // teaching courses
        enrollments: { select: { id: true, course: { select: { id: true, title: true } }, progress: true } }, // enrolled courses
        certificates: true,
        QuizSubmission: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(user)
  } catch (error) {
    res.status(400).json({ error: "Unable to fetch profile" })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const { name, bio, avatarUrl } = req.body

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        avatarUrl,
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        role: true,
      },
    })

    res.json(user)
  } catch (error) {
    res.status(400).json({ error: "Unable to update profile" })
  }
}

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.userId

    await prisma.user.delete({
      where: { id: userId },
    })

    res.status(200).json({ message: "Profile deleted successfully" })
  } catch (error) {
    res.status(400).json({ error: "Unable to delete profile" })
  }
}
