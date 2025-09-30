import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

// User Management
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch users" })
  }
}

export const getUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id)

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        role: true,
      },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const updateUserRole = async (req, res) => {
  try {
    const userId = Number(req.params.id)
    const { role } = req.body

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    if (!role) {
      return res.status(400).json({ error: "Role is required" })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    return res.status(200).json(user)
  } catch (error) {
    console.error("Error updating user role:", error)
    return res.status(500).json({ error: "Failed to update user role" })
  }
}

export const deleteUser = async (req, res) => {
  const userId = Number(req.params.id)

  const existingUser = await prisma.user.findUnique({
    where: { id: Number(userId) },
  })
  if (!existingUser) {
    return res.status(404).json({ error: "User not found" })
  }
  try {
    await prisma.user.delete({
      where: { id: Number(userId) },
    })
    return res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete user" })
  }
}

// Course Management
export const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { instructor: true },
    })
    return res.status(200).json(courses)
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch courses" })
  }
}

export const toggleCoursePublish = async (req, res) => {
  const { courseId } = req.params
  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    })

    const updatedCourse = await prisma.course.update({
      where: { id: Number(courseId) },
      data: { isPublished: !course?.isPublished },
    })

    return res.status(200).json(updatedCourse)
  } catch (error) {
    return res.status(500).json({ error: "Failed to toggle course publish status" })
  }
}

// System Management
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
    })
    return res.status(200).json(logs)
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch audit logs" })
  }
}

export const createAuditLog = async (req, res) => {
  const { action, meta, actorId } = req.body
  try {
    const log = await prisma.auditLog.create({
      data: {
        action,
        meta,
        actorId: actorId ? Number(actorId) : null,
      },
    })
    return res.status(201).json(log)
  } catch (error) {
    return res.status(500).json({ error: "Failed to create audit log" })
  }
}

export const getCourseById = async (req, res) => {
  const { courseId } = req.params
  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      include: { instructor: true, modules: true },
    })
    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }
    return res.status(200).json(course)
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch course" })
  }
}

export const updateCourse = async (req, res) => {
  const { courseId } = req.params
  const { title, description, priceCents, difficulty } = req.body
  try {
    const course = await prisma.course.update({
      where: { id: Number(courseId) },
      data: {
        title,
        description,
        priceCents,
        difficulty,
      },
    })
    return res.status(200).json(course)
  } catch (error) {
    return res.status(500).json({ error: "Failed to update course" })
  }
}

export const deleteCourse = async (req, res) => {
  const { courseId } = req.params
  try {
    await prisma.course.delete({
      where: { id: Number(courseId) },
    })
    return res.status(200).json({ message: "Course deleted successfully" })
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete course" })
  }
}

export const getSystemStats = async (req, res) => {
  try {
    const [userCount, courseCount, enrollmentCount, paymentSum] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.payment.aggregate({
        _sum: {
          amountCents: true,
        },
        where: {
          status: "SUCCEEDED",
        },
      }),
    ])

    return res.status(200).json({
      userCount,
      courseCount,
      enrollmentCount,
      totalRevenueCents: paymentSum._sum.amountCents || 0,
    })
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch system stats" })
  }
}

export const updateSystemSettings = async (req, res) => {
  const { settings } = req.body
  try {
    // Note: Implement actual settings storage logic here
    // This is a placeholder response
    return res.status(200).json({ message: "Settings updated successfully", settings })
  } catch (error) {
    return res.status(500).json({ error: "Failed to update system settings" })
  }
}

// Instructor Management
export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await prisma.user.findMany({
      where: { role: "INSTRUCTOR" },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        courses: {
          select: {
            id: true,
            title: true,
            isPublished: true,
          },
        },
      },
    })

    // Calculate additional stats for each instructor
    const instructorsWithStats = instructors.map((instructor) => ({
      ...instructor,
      totalCourses: instructor.courses.length,
      activeCourses: instructor.courses.filter((course) => course.isPublished).length,
      status: "Active", // Default status, can be enhanced later
    }))

    return res.status(200).json(instructorsWithStats)
  } catch (error) {
    console.error("Error fetching instructors:", error)
    return res.status(500).json({ error: "Failed to fetch instructors" })
  }
}

export const createInstructor = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new instructor
    const instructor = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        bio: bio || null,
        role: "INSTRUCTOR",
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        role: true,
        createdAt: true,
      },
    })

    return res.status(201).json(instructor)
  } catch (error) {
    console.error("Error creating instructor:", error)
    return res.status(500).json({ error: "Failed to create instructor" })
  }
}

export const updateInstructorStatus = async (req, res) => {
  try {
    const instructorId = Number(req.params.id)
    const { status } = req.body

    if (isNaN(instructorId)) {
      return res.status(400).json({ error: "Invalid instructor ID" })
    }

    // For now, we'll just return success since status is not stored in DB
    // In a real app, you might want to add a status field to the User model
    const instructor = await prisma.user.findUnique({
      where: { id: instructorId, role: "INSTRUCTOR" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    if (!instructor) {
      return res.status(404).json({ error: "Instructor not found" })
    }

    return res.status(200).json({
      ...instructor,
      status: status || "Active",
      message: "Status updated successfully",
    })
  } catch (error) {
    console.error("Error updating instructor status:", error)
    return res.status(500).json({ error: "Failed to update instructor status" })
  }
}
