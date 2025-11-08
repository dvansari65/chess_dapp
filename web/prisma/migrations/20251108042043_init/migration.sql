/*
  Warnings:

  - You are about to drop the column `avatar` on the `Player` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publickey]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publickey` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "avatar",
ADD COLUMN     "publickey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Player_publickey_key" ON "Player"("publickey");
