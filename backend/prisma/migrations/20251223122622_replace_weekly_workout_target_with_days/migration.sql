/*
  Warnings:

  - You are about to drop the column `weeklyWorkoutTarget` on the `UserGoal` table. All the data in the column will be lost.
  - Added the required column `weeklyWorkoutDaysTarget` to the `UserGoal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserGoal"
ADD COLUMN "weeklyWorkoutDaysTarget" INTEGER NOT NULL DEFAULT 3;

ALTER TABLE "UserGoal"
DROP COLUMN "weeklyWorkoutTarget";

