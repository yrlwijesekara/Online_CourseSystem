import jwt from "jsonwebtoken";

export const roleCheck = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Authentication token required" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallbacksecret");
            console.log("Decoded JWT:", decoded); // 👈 add this

            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: "You do not have permission" });
            }

            req.userId = decoded.userId;
            req.role = decoded.role;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    };
};