/*
  Warnings:

  - Added the required column `duration` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course" ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" TEXT NOT NULL;
