/*
  Warnings:

  - Added the required column `amount` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChallengeAmount" AS ENUM ('ONE_TENTH', 'ONE_HUNDREDTH', 'ONE_THOUSANDTH', 'ONE_HALF', 'ONE_TWENTIETH', 'ONE_TWO_HUNDREDTH');

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "amount" "ChallengeAmount" NOT NULL;
