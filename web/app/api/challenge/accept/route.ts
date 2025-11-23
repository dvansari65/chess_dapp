import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    console.log("api hit...")
    let body;
    try {
        body = await req.json();
        console.log("body",body)
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
            return NextResponse.json(
                {
                  message: "Please provide challenge ID and current player Key!",
                  success: false
                },
                { status: 400 }
              )
        }
        if (typeof challengeId !== "number") {
            return NextResponse.json(
                {
                  message: "Unexpected type of challenge ID!",
                  success: false
                },
                { status: 400 }
              )
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
        if (challenge.receiverPubKey !== currentPlayerKey) {
            return NextResponse.json(
                {
                    message: "Invalid request!",
                    success: false,
                },
                { status: 403 }
            );
        }
        if (challenge.status !== "pending") {
            return NextResponse.json(
                {
                  message: "Challenge already processed!",
                  success: false
                },
                { status: 400 }
              )
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
