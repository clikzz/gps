/*
  Warnings:

  - You are about to drop the column `birth_date` on the `Pets` table. All the data in the column will be lost.
  - You are about to drop the column `breed` on the `Pets` table. All the data in the column will be lost.
  - Made the column `name` on table `Pets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `species` on table `Pets` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Pets" DROP COLUMN "birth_date",
DROP COLUMN "breed",
ADD COLUMN     "active" BOOLEAN DEFAULT true,
ADD COLUMN     "date_of_adoption" TIMESTAMP(3),
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "fixed" BOOLEAN,
ADD COLUMN     "photo_url" TEXT,
ADD COLUMN     "sex" TEXT,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "species" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserProfiles" ADD COLUMN     "public_id" BIGSERIAL;
