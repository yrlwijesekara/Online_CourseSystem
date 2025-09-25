/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CourseCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `priceCents` on the `Course` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Category_slug_key";

-- DropIndex
DROP INDEX "Category_name_key";

-- DropIndex
DROP INDEX "_CourseCategories_B_index";

-- DropIndex
DROP INDEX "_CourseCategories_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Category";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CourseCategories";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fullDescription" TEXT,
    "category" TEXT NOT NULL DEFAULT 'General',
    "coverImageUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "difficulty" TEXT NOT NULL DEFAULT 'BEGINNER',
    "estimatedDuration" TEXT,
    "prerequisites" TEXT,
    "learningOutcomes" TEXT,
    "language" TEXT NOT NULL DEFAULT 'English',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "instructorId" INTEGER NOT NULL,
    CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Course" ("coverImageUrl", "createdAt", "description", "difficulty", "id", "instructorId", "isPublished", "slug", "title", "updatedAt") SELECT "coverImageUrl", "createdAt", "description", "difficulty", "id", "instructorId", "isPublished", "slug", "title", "updatedAt" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
