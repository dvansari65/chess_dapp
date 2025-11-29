import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


export const RejectChallenge = async(id:number)=>{
    if(!id || typeof id !== "number"){
        throw new Error("challenge id not provided!")
    }
    try {

        const challenge = await prisma.challenge.findUnique({
            where:{
                id:id
            }
        })
        if(challenge?.status === "rejected"){
            return challenge.status
        }
        if(challenge?.status === "accepted"){
            throw new Error("Challenge already in process!")
        }
        if(challenge?.status === "expired"){
            throw new Error("Challenge expired!")
        }
        const updatedChallenge = await prisma.challenge.update({
            where:{
                id,
                expiresAt:{
                    gt:new Date()
                }
            },
            data:{
                status:"rejected"
            }
        })
        if(!challenge){
            return NextResponse.json(
                {
                    message:"Challenge not found!",
                    success:false
                },
                {
                    status:404
                }
            )
        }
        return updatedChallenge.status
    } catch (error) {
        console.log("something went wrong!",error)
        throw error
    }
}

export const AcceptChallenge = async ({challengeId, currentPlayerKey}:{challengeId:number, currentPlayerKey:string}) => {
    try {
        if (!challengeId || !currentPlayerKey) {
            throw new Error("Please provide challenge ID and current player Key!")
        }

        if (typeof challengeId !== "number") {
            throw new Error("Unexpected type of challenge ID!")
        }

        const challenge = await prisma.challenge.findUnique({
            where: {
                id: challengeId,
            },
        });

        if (!challenge) {
            throw new Error("Challenge not found!")
        }

        if (challenge.receiverPubKey !== currentPlayerKey) {
            throw new Error( "Invalid request!")
        }

        if (challenge.status !== "pending") {
            throw new Error("Challenge already processed!")
        }

        const game = await prisma.game.create({
            data:{
                player1PubKey:challenge.receiverPubKey as string,
                player2PubKey:challenge?.senderPubKey as string,
                wageredAmount:Number(challenge.amount),
                status:"waitingForOnChainGameId",
                onChainGameId:null,
                createdAt:new Date(),
                finishedAt:null
            }
        })

        if(!game){
            throw new Error("Game not created!")
        }

        try {
            await prisma.challenge.update({
                where:{
                    id:challengeId
                },
                data:{
                    status:"accepted"
                }
            })
        } catch (error) {
            throw error;
        }

        return game.id;

    } catch (error) {
        console.error(error)
        throw error
     }
};
