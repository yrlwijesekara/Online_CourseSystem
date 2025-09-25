import jwt from "jsonwebtoken";

export const roleCheck = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // Check if user is already attached from authMiddleware
            if (req.user && req.user.role) {
                if (!allowedRoles.includes(req.user.role)) {
                    return res.status(403).json({ message: "You do not have permission" });
                }
                return next();
            }

            // Fallback: try to get from token directly
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Authentication token required" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallbacksecret");
            
            if (!decoded.role) {
                return res.status(401).json({ message: "Token does not contain role information" });
            }

            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: "You do not have permission" });
            }

            req.userId = decoded.userId;
            req.role = decoded.role;
            next();
        } catch (error) {
            console.error("Role check error:", error);
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    };
};