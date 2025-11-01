/*
  Warnings:

  - Added the required column `status` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "playerStatus" AS ENUM ('Online', 'offline');

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "status" "playerStatus" NOT NULL;
