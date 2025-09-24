import multer from "multer";
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// Setup storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = "./uploads";
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
});

export const upload = multer({ storage });

// Upload endpoint
export const uploadContent = async (req, res) => {
    try {
        const files = req.files; // multiple files
        const uploadedFiles = files.map(file => ({
            title: file.originalname,
            url: `/uploads/${file.filename}`,
            type: path.extname(file.originalname).slice(1), // pdf, mp4, etc.
        }));

        res.json({ uploadedFiles });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "File upload failed" });
    }
};

