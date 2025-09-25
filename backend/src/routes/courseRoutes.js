import express from "express";
import {createLesson ,createModule ,createCourse, getAllCourses, deleteCourse, getCourse, updateCourse, togglePublishCourse, getPendingCourses, approveCourse, rejectCourse } from "../controllers/courseController.js";
import {roleCheck} from "../middleware/roleCheck.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const courseRouter = express.Router();

// Public routes (no auth required)
courseRouter.get('/', getAllCourses); // Public can see published courses

// Protected routes (auth required)
courseRouter.use(authMiddleware)

courseRouter.post('/',roleCheck("INSTRUCTOR", "ADMIN") , createCourse);
courseRouter.get('/:id', getCourse);
courseRouter.delete('/:id',roleCheck("INSTRUCTOR", "ADMIN") , deleteCourse);
courseRouter.post('/:id/module',roleCheck("INSTRUCTOR", "ADMIN") , createModule);
courseRouter.post('/module/:moduleId/lesson',roleCheck("INSTRUCTOR", "ADMIN") , createLesson);
courseRouter.put('/:id',roleCheck("INSTRUCTOR", "ADMIN"), updateCourse);
courseRouter.patch('/:id/publish', roleCheck("INSTRUCTOR", "ADMIN") ,togglePublishCourse);

// Admin only routes
courseRouter.get('/admin/pending', roleCheck("ADMIN"), getPendingCourses);
courseRouter.patch('/:id/approve', roleCheck("ADMIN"), approveCourse);
courseRouter.patch('/:id/reject', roleCheck("ADMIN"), rejectCourse);

export default courseRouter;

