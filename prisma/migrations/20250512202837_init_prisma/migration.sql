/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Badges" DROP CONSTRAINT "Badges_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Forum" DROP CONSTRAINT "Forum_user_id_fkey";

-- DropForeignKey
ALTER TABLE "LostPets" DROP CONSTRAINT "LostPets_reported_by_fkey";

-- DropForeignKey
ALTER TABLE "MarketplaceItems" DROP CONSTRAINT "MarketplaceItems_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Pets" DROP CONSTRAINT "Pets_user_id_fkey";

-- DropForeignKey
ALTER TABLE "PhotoLog" DROP CONSTRAINT "PhotoLog_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_user_id_fkey";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "UserProfiles" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "avatar_url" TEXT,

    CONSTRAINT "UserProfiles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pets" ADD CONSTRAINT "Pets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoLog" ADD CONSTRAINT "PhotoLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forum" ADD CONSTRAINT "Forum_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badges" ADD CONSTRAINT "Badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostPets" ADD CONSTRAINT "LostPets_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "UserProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceItems" ADD CONSTRAINT "MarketplaceItems_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
