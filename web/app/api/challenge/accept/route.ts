import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    let body;
    try {
        body = await req.json();
    } catch (error) { 
        return NextResponse.json(
            {
                message:"Invalid JSON format!",
                success:false
            },
            {status:400}
        )
    }
    try {
        const { challengeId, currentPlayerKey } = body;

        if (!challengeId || !currentPlayerKey) {
            throw new Error("Please provide challenge ID and current player Key!");
        }
        if (typeof challengeId !== "number") {
            throw new Error("Unexpected type of challenge ID!");
        }

        const challenge = await prisma.challenge.findUnique({
            where: {
                id: challengeId,
            },
        });
        if (!challenge) {
            return NextResponse.json(
                {
                    message: "Challenge not found!",
                    challenge,
                    success: false,
                },
                { status: 404 }
            );
        }
        if (!challenge.receiverPubKey !== currentPlayerKey) {
            return NextResponse.json(
                {
                    message: "Invalid request!",
                    success: false,
                },
                { status: 403 }
            );
        }
        if (challenge.status !== "pending") {
            throw new Error("Challenge already processed!");
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
            return NextResponse.json(
                {
                    message:"Game not created!",
                    success:false
                },
                {status:500}
            )
        }

        await prisma.challenge.update({
            where:{
                id:challengeId
            },
            data:{
                status:"accepted"
            }
        })
        return NextResponse.json(
            {
                message:"Game created successfully!",
                success:true,
                game
            },
            {status:200}
        )
    } catch (error) {
        console.error(error)
        throw error
     }
};
