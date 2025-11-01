-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "isPlaying" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'offline';
