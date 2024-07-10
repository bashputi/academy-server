/*
  Warnings:

  - You are about to drop the column `site_notification` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `coverimage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileimage` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "site_notification",
ADD COLUMN     "siteNotification" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "content",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "updatedAt",
ADD COLUMN     "QNA" BOOLEAN,
ADD COLUMN     "about" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "certificateTemplate" TEXT,
ADD COLUMN     "coursePrerequisites" TEXT,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "difficultyLevel" TEXT,
ADD COLUMN     "introVideo" TEXT,
ADD COLUMN     "maxStudent" INTEGER,
ADD COLUMN     "publicCourse" BOOLEAN,
ADD COLUMN     "thumbnail" TEXT,
ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "coverimage",
DROP COLUMN "profileimage",
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "profileImage" TEXT;

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "regular" INTEGER,
    "discounted" INTEGER,
    "courseId" TEXT,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseBuilder" (
    "id" TEXT NOT NULL,
    "topicName" TEXT,
    "topicSummery" TEXT,
    "courseId" TEXT,

    CONSTRAINT "CourseBuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "lessonName" TEXT,
    "lessonContent" TEXT,
    "lessonImage" TEXT,
    "lessonVideo" TEXT,
    "videoTime" TEXT,
    "courseBuilderId" TEXT,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "quizName" TEXT,
    "quizSummery" TEXT,
    "quizSettingsId" TEXT,
    "courseBuilderId" TEXT,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT,
    "questionType" TEXT,
    "answerRequired" BOOLEAN,
    "point" INTEGER,
    "description" TEXT,
    "answer" TEXT,
    "quizId" TEXT,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizSettings" (
    "id" TEXT NOT NULL,
    "timeLimit" INTEGER,
    "quizFeedback" TEXT,
    "attemptsAllowed" INTEGER,
    "passingGrade" INTEGER,
    "maxQuestion" INTEGER,
    "autoStart" BOOLEAN,
    "questionLayout" TEXT,
    "randomOrder" TEXT,
    "hideQuestionNumber" BOOLEAN,
    "shortAnswerCharacters" INTEGER,
    "essayQuestionAnswerLimit" BOOLEAN,

    CONSTRAINT "QuizSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "summary" TEXT,
    "attachments" TEXT,
    "timeLimit" TEXT,
    "totalPoint" INTEGER,
    "minimumPassPoint" INTEGER,
    "allowUpload" INTEGER,
    "maximumFileSize" INTEGER,
    "courseBuilderId" TEXT,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instructor" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "courseId" TEXT,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "courseId" TEXT,
    "lessonId" TEXT,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdditionalData" (
    "id" TEXT NOT NULL,
    "willLearn" TEXT,
    "targetAudience" TEXT,
    "courseDuration" TEXT,
    "materials" TEXT,
    "requirements" TEXT,
    "tags" TEXT,
    "courseId" TEXT,

    CONSTRAINT "AdditionalData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_quizSettingsId_key" ON "Quiz"("quizSettingsId");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_courseBuilderId_key" ON "Assignment"("courseBuilderId");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseBuilder" ADD CONSTRAINT "CourseBuilder_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_courseBuilderId_fkey" FOREIGN KEY ("courseBuilderId") REFERENCES "CourseBuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_quizSettingsId_fkey" FOREIGN KEY ("quizSettingsId") REFERENCES "QuizSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_courseBuilderId_fkey" FOREIGN KEY ("courseBuilderId") REFERENCES "CourseBuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_courseBuilderId_fkey" FOREIGN KEY ("courseBuilderId") REFERENCES "CourseBuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalData" ADD CONSTRAINT "AdditionalData_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
