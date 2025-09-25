// index.js
import dotenv from "dotenv";
import app from "./app.js"; // Verify this path

dotenv.config();

const requiredEnv = ["DATABASE_URL", "JWT_SECRET", "PORT"];
for (const env of requiredEnv) {
    if (!process.env[env]) {
        console.error(`Missing environment variable: ${env}`);
        process.exit(1);
    }
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port} in ${process.env.NODE_ENV || "development"} mode`);
});