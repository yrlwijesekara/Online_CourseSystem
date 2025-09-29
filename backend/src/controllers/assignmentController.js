import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

// Get all assignments
export const getAllAssignments = async (req, res) => {
    try {
        const assignments = await prisma.assignment.findMany();
        res.json(assignments);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch assignments'});
    }
};

// Get all assignments for a lesson by lessonId
export const getAssignmentsByLesson = async (req, res) => {
    try {
        const lessonId = parseInt(req.params.id);
        if (isNaN(lessonId)) {
            return res.status(400).json({error: 'Invalid lessonId'});
        }
        const assignments = await prisma.assignment.findMany({
            where: {lessonId: lessonId}
        });
        res.json(assignments);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch assignments for lesson'});
    }
};

// Get a single assignment by id
export const getAssignmentById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({error: 'Invalid assignment id'});
        }
        const assignment = await prisma.assignment.findUnique({
            where: {id: id}
        });
        if (!assignment) {
            return res.status(404).json({error: 'Assignment not found'});
        }
        res.json(assignment);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch assignment'});
    }
}

// Create a new assignment
export const createAssignment = async (req, res) => {
    if (req.user.role !== 'INSTRUCTOR' && req.user.role !== 'ADMIN') {
        return res.status(403).json({error: 'Only instructors and admins can create assignments'});
    }
    try {
        const {lessonId, title, description, dueDate, contents} = req.body;
        const assignment = await prisma.assignment.create({
            data: {
                lessonId: parseInt(lessonId),
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : null,
                contents: contents || null
            }
        });
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({error: 'Failed to create assignment'});
    }
};

// Update assignment
export const updateAssignment = async (req, res) => {
    if (req.user.role !== 'INSTRUCTOR' && req.user.role !== 'ADMIN') {
        return res.status(403).json({error: 'Only instructors and admins can update assignments'});
    }
    try {
        const {id} = req.params;
        const {title, description, dueDate, contents} = req.body;
        const assignment = await prisma.assignment.update({
            where: {id: parseInt(id)},
            data: {
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : null,
                contents: contents || null
            }
        });
        res.json(assignment);
    } catch (error) {
        res.status(500).json({error: 'Failed to update assignment'});
    }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
    if (!(req.user.role === 'INSTRUCTOR' || req.user.role === 'ADMIN')) {
        return res.status(403).json({error: 'Only instructors and admins can delete assignments'});
    }
    try {
        const {id} = req.params;
        await prisma.assignment.delete({
            where: {id: parseInt(id)}
        });
        // Send only one response - choose either a 200 with message or a 204 with no content
        return res.status(200).json({message: 'Assignment deleted successfully'});
    } catch (error) {
        res.status(500).json({error: 'Failed to delete assignment'});
    }
};

// Submit assignment
export const submitAssignment = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { contentUrl, text } = req.body;
        const userId = req.user.id; // authenticated user

        // Fetch assignment
        const assignment = await prisma.assignment.findUnique({
            where: { id }
        });

        if (!assignment) return res.status(404).json({ error: "Assignment not found" });

        // Check deadline
        if (assignment.dueDate && new Date() > assignment.dueDate) {
            return res.status(400).json({ error: "Submissions are not allowed after the due date" });
        }

        // Create submission
        const submission = await prisma.submission.create({
            data: {
                assignmentId: id,
                userId,
                contentUrl: contentUrl || null,
                text: text || null,
                submittedAt: new Date(),
            }
        });

        res.status(201).json(submission);

    } catch (error) {
        console.error("Error submitting assignment:", error);
        res.status(500).json({ error: "Failed to submit assignment" });
    }
};

// Grade submission
export const gradeSubmission = async (req, res) => {
    try {
        const submissionId = parseInt(req.params.submissionId, 10);
        const { grade, feedback } = req.body;

        if (isNaN(submissionId)) {
            console.log("Params:", req.params);
            console.log("Body:", req.body);
            return res.status(400).json({ error: "Invalid submission ID" });
        }

        const parsedGrade = parseInt(grade, 10);
        if (isNaN(parsedGrade)) {
            return res.status(400).json({ error: "Grade must be a number" });
        }

        const submission = await prisma.submission.update({
            where: { id: submissionId },
            data: {
                grade: parsedGrade,
                feedback,
                gradedAt: new Date()
            }
        });


        res.status(200).json(submission);

    } catch (error) {

        console.error("Error grading submission:", error);
        res.status(500).json({ error: "Failed to grade submission" });
    }
};