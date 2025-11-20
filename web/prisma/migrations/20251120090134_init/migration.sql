/*
  Warnings:

  - Added the required column `status` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('pending', 'accepted', 'rejected', 'expired');

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "status" "ChallengeStatus" NOT NULL;
