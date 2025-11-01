-- CreateTable
CREATE TABLE "Player" (
    "userName" TEXT NOT NULL,
    "matchesPlayed" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "lost" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "solWon" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_userName_key" ON "Player"("userName");
