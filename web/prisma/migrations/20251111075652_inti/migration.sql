-- CreateTable
CREATE TABLE "Challenge" (
    "id" SERIAL NOT NULL,
    "senderPubKey" TEXT NOT NULL,
    "receiverPubKey" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_senderPubKey_key" ON "Challenge"("senderPubKey");

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_receiverPubKey_key" ON "Challenge"("receiverPubKey");

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_senderPubKey_fkey" FOREIGN KEY ("senderPubKey") REFERENCES "Player"("publickey") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_receiverPubKey_fkey" FOREIGN KEY ("receiverPubKey") REFERENCES "Player"("publickey") ON DELETE RESTRICT ON UPDATE CASCADE;
