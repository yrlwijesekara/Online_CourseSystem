import express from 'express';
import {
    createQuizWithQuestions,
    deleteQuiz,
    submitQuiz,
    getQuizById,
    getAllQuizzes,
    getQuizSubmissions, updateQuiz
} from "../controllers/quizController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {roleCheck} from "../middleware/roleCheck.js";

const quizRouter = express.Router();

quizRouter.use(authMiddleware);

quizRouter.post('/',roleCheck("INSTRUCTOR") , createQuizWithQuestions);
quizRouter.get('/', getAllQuizzes);
quizRouter.delete('/:id',roleCheck("INSTRUCTOR", "ADMIN") , deleteQuiz);
quizRouter.post('/:id/submit',roleCheck("STUDENT") , submitQuiz);
quizRouter.get('/:id', getQuizById);
quizRouter.get('/:id/submissions',roleCheck("INSTRUCTOR", "ADMIN") , getQuizSubmissions);
quizRouter.put('/:id/update', roleCheck("INSTRUCTOR", "ADMIN"), updateQuiz)


export default quizRouter;