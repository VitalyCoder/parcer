-- CreateTable
CREATE TABLE "persons" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "sfedu_email" VARCHAR(255),
    "photo_url" VARCHAR(255),
    "last_name" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "middle_name" VARCHAR(255),
    "is_student" BOOLEAN NOT NULL,
    "is_employee" BOOLEAN NOT NULL,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentsProfiles" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "course" INTEGER NOT NULL,
    "education_form" VARCHAR(255) NOT NULL,
    "education_level" VARCHAR(255) NOT NULL,
    "group_internal" VARCHAR(255) NOT NULL,
    "group_official" VARCHAR(255) NOT NULL,
    "record_book_num" VARCHAR(255) NOT NULL,
    "specialty_id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "vpk_groups" VARCHAR(255)[],
    "debts" VARCHAR(255)[],
    "practices" VARCHAR(255)[],
    "group_id" TEXT NOT NULL,

    CONSTRAINT "studentsProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employeesProfiles" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "academic_title" VARCHAR(255),
    "academic_degree" VARCHAR(255),
    "education_details" VARCHAR(255),
    "general_experience_start" TIMESTAMP(3),
    "field_experience_years" INTEGER NOT NULL,
    "disciplines" TEXT[],

    CONSTRAINT "employeesProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employments" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "employee_profile_id" TEXT NOT NULL,
    "position" VARCHAR(255) NOT NULL,
    "employment_type" VARCHAR(255) NOT NULL,
    "department_id" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "employments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholarships" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "student_profile_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "type" VARCHAR(255) NOT NULL,

    CONSTRAINT "scholarships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "abbreviation" VARCHAR(255) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialties" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educationsPlans" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "plan_number" VARCHAR(255) NOT NULL,

    CONSTRAINT "educationsPlans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "degree" VARCHAR(255) NOT NULL,
    "education_form" VARCHAR(255) NOT NULL,
    "course" INTEGER NOT NULL,
    "plan_id" TEXT NOT NULL,
    "specialty_id" TEXT NOT NULL,
    "direction_code" VARCHAR(255) NOT NULL,
    "direction_name" VARCHAR(255) NOT NULL,
    "program_name" VARCHAR(255) NOT NULL,
    "program_full" VARCHAR(255) NOT NULL,
    "program_link" VARCHAR(255) NOT NULL,
    "department_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "room_number" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "name_english" VARCHAR(255) NOT NULL,
    "department_id" TEXT,
    "description" VARCHAR(255),
    "seat_count" INTEGER NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipments" (
    "id" UUID NOT NULL,
    "room_id" TEXT NOT NULL,
    "computer_count" INTEGER NOT NULL,
    "specs" VARCHAR(255) NOT NULL,

    CONSTRAINT "equipments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "persons_key_key" ON "persons"("key");

-- CreateIndex
CREATE UNIQUE INDEX "persons_sfedu_email_key" ON "persons"("sfedu_email");

-- CreateIndex
CREATE UNIQUE INDEX "studentsProfiles_key_key" ON "studentsProfiles"("key");

-- CreateIndex
CREATE UNIQUE INDEX "employeesProfiles_key_key" ON "employeesProfiles"("key");

-- CreateIndex
CREATE UNIQUE INDEX "employments_key_key" ON "employments"("key");

-- CreateIndex
CREATE UNIQUE INDEX "scholarships_key_key" ON "scholarships"("key");

-- CreateIndex
CREATE UNIQUE INDEX "departments_key_key" ON "departments"("key");

-- CreateIndex
CREATE UNIQUE INDEX "specialties_key_key" ON "specialties"("key");

-- CreateIndex
CREATE UNIQUE INDEX "specialties_code_key" ON "specialties"("code");

-- CreateIndex
CREATE UNIQUE INDEX "educationsPlans_key_key" ON "educationsPlans"("key");

-- CreateIndex
CREATE UNIQUE INDEX "groups_key_key" ON "groups"("key");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_key_key" ON "rooms"("key");

-- AddForeignKey
ALTER TABLE "studentsProfiles" ADD CONSTRAINT "studentsProfiles_id_fkey" FOREIGN KEY ("id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employeesProfiles" ADD CONSTRAINT "employeesProfiles_id_fkey" FOREIGN KEY ("id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
