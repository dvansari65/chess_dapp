import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server"


export const GET = async (req:NextRequest)=>{
    try {
        const body = await req.json();
        const {publicKey} = body
        if(!publicKey || typeof publicKey !== "string"){
            return NextResponse.json(
                {
                    message:"Public key is missing!",
                    success:false
                },
                {
                    status:400
                }
            )
        }
        const challenges = await prisma.challenge.findMany({
            where:{
                receiverPubKey:publicKey
            },
            select:{}
        })
        if(!challenges || challenges.length === 0){
            return NextResponse.json(
                {
                    message:"No challenges found!",
                    challenges:[],
                    success:false
                },
                {
                    status:404
                }
            )
        }
        return NextResponse.json(
            {
                message:"Recieved challenges found successfully!",
                success:true,
                challenges
            },
            {
                status:200
            }
        )

    } catch (error:any) {
        return NextResponse.json(
            {
                error:error.message || "FAILED TO GET RECIEVED CHALLENGES!",
                success:false
            },
            {
                status:500
            }
        )
    }
}