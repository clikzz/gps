-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pets" (
    "id" BIGSERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT,
    "species" TEXT,
    "breed" TEXT,
    "birth_date" TIMESTAMP(3),

    CONSTRAINT "Pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoLog" (
    "id" BIGSERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "photo_url" TEXT,
    "title" TEXT,
    "description" TEXT,
    "taken_at" TIMESTAMP(3),
    "hashtags" TEXT[],

    CONSTRAINT "PhotoLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaccinations" (
    "id" BIGSERIAL NOT NULL,
    "pet_id" BIGINT NOT NULL,
    "type" TEXT,
    "application_date" TIMESTAMP(3),
    "next_dose_date" TIMESTAMP(3),

    CONSTRAINT "Vaccinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medications" (
    "id" BIGSERIAL NOT NULL,
    "pet_id" BIGINT NOT NULL,
    "name" TEXT,
    "dose" TEXT,
    "duration" TEXT,

    CONSTRAINT "Medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Forum" (
    "id" BIGSERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Forum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badges" (
    "id" BIGSERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "badge_type" TEXT,
    "awarded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Services" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT,
    "address" TEXT,
    "hours" TEXT,
    "contact_info" TEXT,
    "average_rating" DOUBLE PRECISION,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" BIGSERIAL NOT NULL,
    "service_id" BIGINT NOT NULL,
    "user_id" UUID NOT NULL,
    "rating" INTEGER,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LostPets" (
    "id" BIGSERIAL NOT NULL,
    "pet_id" BIGINT NOT NULL,
    "reported_by" UUID NOT NULL,
    "location" TEXT,
    "reported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LostPets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceItems" (
    "id" BIGSERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT,
    "image_url" TEXT,
    "description" TEXT,
    "condition" TEXT,
    "price" DOUBLE PRECISION,
    "contact_method" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT DEFAULT 'active',

    CONSTRAINT "MarketplaceItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pets" ADD CONSTRAINT "Pets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoLog" ADD CONSTRAINT "PhotoLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccinations" ADD CONSTRAINT "Vaccinations_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medications" ADD CONSTRAINT "Medications_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forum" ADD CONSTRAINT "Forum_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badges" ADD CONSTRAINT "Badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostPets" ADD CONSTRAINT "LostPets_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostPets" ADD CONSTRAINT "LostPets_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceItems" ADD CONSTRAINT "MarketplaceItems_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
