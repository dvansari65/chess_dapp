-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('pending', 'started', 'draw', 'finished');

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "onChainGameId" INTEGER NOT NULL,
    "player1PubKey" TEXT NOT NULL,
    "player2PubKey" TEXT NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'pending',
    "wageredAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_onChainGameId_key" ON "Game"("onChainGameId");

-- CreateIndex
CREATE UNIQUE INDEX "Game_player1PubKey_key" ON "Game"("player1PubKey");

-- CreateIndex
CREATE UNIQUE INDEX "Game_player2PubKey_key" ON "Game"("player2PubKey");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player1PubKey_fkey" FOREIGN KEY ("player1PubKey") REFERENCES "Player"("publickey") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player2PubKey_fkey" FOREIGN KEY ("player2PubKey") REFERENCES "Player"("publickey") ON DELETE RESTRICT ON UPDATE CASCADE;
