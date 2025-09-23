import express from "express";
import {roleCheck} from "../middleware/roleCheck.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {createAssignment, getAssignmentsByLesson, deleteAssignment, updateAssignment,
    submitAssignment, gradeSubmission, getAllAssignments, getAssignmentById} from "../controllers/assignmentController.js";

const assignmentRouter = express.Router();
assignmentRouter.use(authMiddleware)

assignmentRouter.post('/',roleCheck("INSTRUCTOR", "ADMIN") , createAssignment);
assignmentRouter.get('/lesson/:id', getAssignmentsByLesson);
assignmentRouter.get('/', getAllAssignments);
assignmentRouter.get('/:id', getAssignmentById)
assignmentRouter.delete('/:id',roleCheck("INSTRUCTOR", "ADMIN") , deleteAssignment);
assignmentRouter.put('/:id',roleCheck("INSTRUCTOR", "ADMIN") , updateAssignment);
assignmentRouter.post('/:id/submit', submitAssignment);
assignmentRouter.put('/submission/:submissionId/grade',roleCheck("INSTRUCTOR", "ADMIN") , gradeSubmission);

export default assignmentRouter;