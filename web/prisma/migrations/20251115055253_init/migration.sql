/*
  Warnings:

  - You are about to drop the column `amount` on the `Player` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "amount" "ChallengeAmount" NOT NULL;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "amount";
