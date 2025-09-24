import { Router } from "express";
import userRouter from "./src/routes/userRoutes.js";
import adminRouter from "./src/routes/adminRoutes.js";
import courseRouter from "./src/routes/courseRoutes.js";
import quizRouter from "./src/routes/quizRoutes.js";
import assignmentRouter from "./src/routes/assignmentRoutes.js";
import enrollRouter from "./src/routes/enrollmentRoutes.js";
import messageRouter from "./src/routes/messageRoutes.js";
import certificateRouter from "./src/routes/certificateRoutes.js";
import forumRouter from "./src/routes/forumRoutes.js";

const router = Router();
router.use("/auth", userRouter);
router.use("/admin", adminRouter)
router.use("/courses", courseRouter)  // Changed from "/course" to "/courses"
router.use("/quiz", quizRouter)
router.use("/assignment", assignmentRouter)
router.use("/enrollment", enrollRouter)
router.use("/message", messageRouter)
router.use("/certificate", certificateRouter)
router.use("/forum", forumRouter)

export default router;