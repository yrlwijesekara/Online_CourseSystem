import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleCheck } from "../middleware/roleCheck.js";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getSystemStats,
  updateSystemSettings,
  getAuditLogs,
  toggleCoursePublish,
  getAllInstructors,
  createInstructor,
  updateInstructorStatus,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Apply auth to all routes first
adminRouter.use(authMiddleware);

// User Management Routes
adminRouter.get("/users", roleCheck(["ADMIN"]), getAllUsers);
adminRouter.get("/users/:id", roleCheck(["ADMIN"]), getUserById);
adminRouter.put("/users/:id", roleCheck(["ADMIN"]), updateUserRole);
adminRouter.delete("/users/:id", roleCheck(["ADMIN"]), deleteUser);

// Instructor Management Routes
adminRouter.get("/instructors", roleCheck(["ADMIN"]), getAllInstructors);
adminRouter.post("/instructors", roleCheck(["ADMIN"]), createInstructor);
adminRouter.put("/instructors/:id/status", roleCheck(["ADMIN"]), updateInstructorStatus);

// Course Management Routes
adminRouter.get("/courses", roleCheck(["ADMIN", "INSTRUCTOR"]), getAllCourses);
adminRouter.get("/courses/:id", roleCheck(["ADMIN", "INSTRUCTOR"]), getCourseById);
adminRouter.put("/courses/:id", roleCheck(["ADMIN", "INSTRUCTOR"]), updateCourse);
adminRouter.delete("/courses/:id", roleCheck(["ADMIN", "INSTRUCTOR"]), deleteCourse);
adminRouter.put("/courses/:id/publish", roleCheck(["ADMIN", "INSTRUCTOR"]), toggleCoursePublish);

// System Administration Routes
adminRouter.get("/stats", roleCheck(["ADMIN"]), getSystemStats);
adminRouter.put("/settings", roleCheck(["ADMIN"]), updateSystemSettings);
adminRouter.get("/audit-logs", roleCheck(["ADMIN"]), getAuditLogs);

export default adminRouter;
