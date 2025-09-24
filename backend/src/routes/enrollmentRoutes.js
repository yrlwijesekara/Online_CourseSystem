import express from 'express';
import {roleCheck} from "../middleware/roleCheck.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {enrollInCourse, getMyEnrollments, unenrollFromCourse, getStudentsForCourseAdmin, getStudentsForInstructor} from "../controllers/enrollmentController.js";

const enrollRouter = express.Router();

enrollRouter.use(authMiddleware)

enrollRouter.post('/:courseId/enroll', enrollInCourse);
enrollRouter.get('/my', getMyEnrollments);
enrollRouter.delete('/:courseId', unenrollFromCourse);

enrollRouter.get('/instructor/students',roleCheck('INSTRUCTOR'), getStudentsForInstructor);
enrollRouter.get('/admin/courses/:courseId', roleCheck('ADMIN'), getStudentsForCourseAdmin);

export default enrollRouter;


