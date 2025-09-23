import { PrismaClient } from "@prisma/client";
import PDFDocument from "pdfkit";

const prisma = new PrismaClient();

// Middleware: role check helper
const hasRole = (user, roles) => roles.includes(user.role);

// Generate a certificate when a student completes a course
export const generateCertificate = async (req, res) => {
    try {
        const userId = Number(req.body.userId);
        const courseId = Number(req.body.courseId);

        if (!userId || !courseId) {
            return res.status(400).json({ error: "Invalid userId or courseId" });
        }

        // Only ADMIN or INSTRUCTOR can generate certificates
        if (!hasRole(req.user, ["ADMIN", "INSTRUCTOR"])) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Check if the certificate already exists
        const existing = await prisma.certificate.findFirst({
            where: { userId, courseId }
        });

        if (existing) {
            return res.status(400).json({ error: "Certificate already issued" });
        }

        // Create certificate entry
        const certificate = await prisma.certificate.create({
            data: {
                userId,
                courseId,
                issuedAt: new Date(),
                isRevoked: false
            }
        });

        res.status(201).json({ message: "Certificate generated", certificateId: certificate.id });
    } catch (err) {
        console.error("Certificate generation error:", err);

        // Check for Prisma unique constraint error
        if (err.code === "P2002") {
            return res.status(400).json({ error: "Certificate already exists" });
        }

        res.status(500).json({ error: "Failed to generate certificate" });
    }
};

// Get all certificates for a student
export const getUserCertificates = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (!userId) return res.status(400).json({ error: "Invalid userId" });

        // Only the user themselves or ADMIN/INSTRUCTOR can access
        if (req.user.id !== userId && !hasRole(req.user, ["ADMIN", "INSTRUCTOR"])) {
            return res.status(403).json({ error: "Access denied" });
        }

        const certificates = await prisma.certificate.findMany({
            where: { userId },
            include: {
                course: { select: { id: true, title: true } } // avoid exposing sensitive info
            }
        });

        res.json(certificates);
    } catch (err) {
        console.error("Get user certificates error:", err);
        res.status(500).json({ error: "Failed to fetch certificates" });
    }
};

// Download a certificate as PDF
export const downloadCertificate = async (req, res) => {
    try {
        const certificateId = Number(req.params.id);
        if (!certificateId) return res.status(400).json({ error: "Invalid certificateId" });

        const certificate = await prisma.certificate.findUnique({
            where: { id: certificateId },
            include: { user: true, course: true }
        });

        if (!certificate || certificate.isRevoked) {
            return res.status(404).json({ error: "Certificate not found or revoked" });
        }

        // Only the owner, ADMIN, or INSTRUCTOR can download
        if (req.user.id !== certificate.userId && !hasRole(req.user, ["ADMIN", "INSTRUCTOR"])) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Generate PDF
        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=certificate-${certificate.id}.pdf`
        );

        doc.fontSize(24).text("Certificate of Completion", { align: "center" });
        doc.moveDown();
        doc.fontSize(18).text(`This is to certify that:`, { align: "center" });
        doc.moveDown();
        doc.fontSize(20).text(`${certificate.user.name}`, { align: "center" });
        doc.moveDown();
        doc.fontSize(16).text(`has successfully completed the course`, { align: "center" });
        doc.moveDown();
        doc.fontSize(20).text(`${certificate.course.title}`, { align: "center" });
        doc.moveDown();
        doc.fontSize(14).text(`Issued on: ${certificate.issuedAt.toDateString()}`, { align: "center" });

        doc.end();
        doc.pipe(res);
    } catch (err) {
        console.error("Download certificate error:", err);
        res.status(500).json({ error: "Failed to download certificate" });
    }
};

// Verify a certificate (ADMIN/INSTRUCTOR)
export const verifyCertificate = async (req, res) => {
    try {
        const certificateId = Number(req.params.id);
        if (!certificateId) return res.status(400).json({ error: "Invalid certificateId" });

        if (!hasRole(req.user, ["ADMIN", "INSTRUCTOR"])) {
            return res.status(403).json({ error: "Access denied" });
        }

        const certificate = await prisma.certificate.findUnique({
            where: { id: certificateId },
            include: { user: true, course: true }
        });

        if (!certificate) return res.status(404).json({ error: "Certificate not found" });

        res.json({
            id: certificate.id,
            user: certificate.user.name,
            course: certificate.course.title,
            issuedAt: certificate.issuedAt,
            status: certificate.isRevoked ? "Revoked" : "Valid"
        });
    } catch (err) {
        console.error("Verify certificate error:", err);
        res.status(500).json({ error: "Failed to verify certificate" });
    }
};

// Revoke a certificate (ADMIN/INSTRUCTOR)
export const revokeCertificate = async (req, res) => {
    try {
        const certificateId = Number(req.params.id);
        if (!certificateId) return res.status(400).json({ error: "Invalid certificateId" });

        if (!hasRole(req.user, ["ADMIN", "INSTRUCTOR"])) {
            return res.status(403).json({ error: "Access denied" });
        }

        const certificate = await prisma.certificate.update({
            where: { id: certificateId },
            data: { isRevoked: true }
        });

        res.json({ message: "Certificate revoked", certificateId: certificate.id });
    } catch (err) {
        console.error("Revoke certificate error:", err);
        res.status(500).json({ error: "Failed to revoke certificate" });
    }
};