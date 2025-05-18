-- AlterTable
ALTER TABLE "UserProfiles" ALTER COLUMN "public_id" DROP NOT NULL,
ALTER COLUMN "public_id" SET DEFAULT nextval('userprofiles_public_id_seq'),
ALTER COLUMN "public_id" DROP DEFAULT;
DROP SEQUENCE "UserProfiles_public_id_seq";
