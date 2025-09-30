import {prisma} from "../config/db.js";

// --------------------------- STUDENT ACTIONS ---------------------------

// Enroll a student in a course
export const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        // Check if already enrolled
        const existing = await prisma.enrollment.findFirst({
            where: { courseId: Number(courseId), userId },
        });

        if (existing) {
            return res.status(400).json({ error: "Already enrolled in this course" });
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                courseId: Number(courseId),
                userId,
                enrolledAt: new Date(),
            },
        });

        res.status(201).json(enrollment);
    } catch (error) {
        console.error("Error enrolling in course:", error);
        res.status(500).json({ error: "Failed to enroll in course" });
    }
};

// Get all courses student enrolled in
export const getMyEnrollments = async (req, res) => {
    try {
        const userId = req.user.id;
        const enrollments = await prisma.enrollment.findMany({
            where: { userId },
            include: { course: true },
        });

        res.status(200).json(enrollments);
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        res.status(500).json({ error: "Failed to fetch enrollments" });
    }
};

// Unenroll student from a course
export const unenrollFromCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        const enrollment = await prisma.enrollment.findFirst({
            where: { courseId: Number(courseId), userId },
        });

        if (!enrollment) {
            return res.status(404).json({ error: "Enrollment not found" });
        }

        await prisma.enrollment.delete({
            where: { id: enrollment.id },
        });

        res.status(200).json({ message: "Unenrolled successfully" });
    } catch (error) {
        console.error("Error unenrolling from course:", error);
        res.status(500).json({ error: "Failed to unenroll" });
    }
};

// --------------------------- ADMIN ACTIONS ---------------------------

// Get all enrolled + unenrolled students for a course
export const getStudentsForCourseAdmin = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Find all users
        const allStudents = await prisma.user.findMany({
            where: { role: "STUDENT" },
            include: {
                enrollments: {
                    where: { courseId: Number(courseId) }
                },
            },
        });

        const enrolled = allStudents.filter(u => u.enrollments.length > 0);
        const unenrolled = allStudents.filter(u => u.enrollments.length === 0);

        res.status(200).json({ enrolled, unenrolled });
    } catch (error) {
        console.error("Error fetching students for course (Admin):", error);
        res.status(500).json({ error: "Failed to fetch students" });
    }
};

// --------------------------- INSTRUCTOR ACTIONS ---------------------------

// Get students enrolled in courses created by instructor
export const getStudentsForInstructor = async (req, res) => {
    try {
        const instructorId = req.user.id;

        const courses = await prisma.course.findMany({
            where: { instructorId },
            include: {
                _count: {
                    select: { enrollments: true },
                },
                enrollments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
                modules: {
                    include: {
                        lessons: {
                            include: {
                                quizzes: {
                                    include: {
                                        submissions: {
                                            include: {
                                                user: {
                                                    select: {
                                                        id: true,
                                                        name: true,
                                                        email: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const result = courses.map(course => ({
            id: course.id,
            title: course.title,
            studentsCount: course._count.enrollments,
            students: course.enrollments.map(e => e.user),
            quizzes: course.modules.flatMap(m =>
                m.lessons.flatMap(l =>
                    l.quizzes.map(q => ({
                        id: q.id,
                        title: q.title,
                        totalMarks: q.totalMarks,
                        submissions: q.submissions.map(s => ({
                            id: s.id,
                            user: s.user,
                            marksObtained: s.marksObtained,
                            submittedAt: s.submittedAt,
                        })),
                    }))
                )
            ),
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching students + quizzes for instructor:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
};