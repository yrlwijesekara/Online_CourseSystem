import express from "express";
import {createLesson ,createModule ,createCourse, getAllCourses, deleteCourse, getCourse, updateCourse, togglePublishCourse, } from "../controllers/courseController.js";
import {roleCheck} from "../middleware/roleCheck.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const courseRouter = express.Router();
courseRouter.use(authMiddleware)

courseRouter.post('/',roleCheck("INSTRUCTOR", "ADMIN") , createCourse);
courseRouter.get('/', getAllCourses);
courseRouter.get('/:id', getCourse);
courseRouter.delete('/:id',roleCheck("INSTRUCTOR", "ADMIN") , deleteCourse);
courseRouter.post('/:id/module',roleCheck("INSTRUCTOR", "ADMIN") , createModule);
courseRouter.post('/module/:moduleId/lesson',roleCheck("INSTRUCTOR", "ADMIN") , createLesson);
courseRouter.put('/:id',roleCheck("INSTRUCTOR", "ADMIN"), updateCourse);
courseRouter.patch('/:id/publish', roleCheck("INSTRUCTOR", "ADMIN") ,togglePublishCourse);

export default courseRouter;

