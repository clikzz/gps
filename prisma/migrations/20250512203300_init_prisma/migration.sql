/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `UserProfiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `UserProfiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserProfiles" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserProfiles_email_key" ON "UserProfiles"("email");
