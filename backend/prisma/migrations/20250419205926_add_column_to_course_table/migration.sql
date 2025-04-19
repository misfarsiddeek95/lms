/*
  Warnings:

  - Added the required column `currency` to the `course` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `price` on the `course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "course" ADD COLUMN     "currency" TEXT NOT NULL,
DROP COLUMN "price",
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL;
