import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req:NextRequest)=>{
    let body;
    try {
        body = await req.json();
    } catch (error) {
        return NextResponse.json(
            {
                message:"INVALID JSON FORMAT!",
                success:false
            },
            {
                status:400
            }
        )
    }
    try {
        const { publicKey }:{ publicKey:string } = body
        
        if(!publicKey || typeof publicKey !== "string"){
            return NextResponse.json(
                {
                    message:"PUBLICKEY NOT PROVIDED!",
                    success:false
                },
                {
                    status:400
                }
            )
        }

        const sentChallenges = await prisma.challenge.findMany({
            where:{
                senderPubKey:publicKey
            }
        })
        if(!sentChallenges || sentChallenges.length === 0){
            return NextResponse.json(
                {
                    message : "SENT CHALLENGES NOT FOUND!",
                    success:false
                },
                {
                    status:404
                }
            )
        }
        return NextResponse.json(
            {
                message:"SENT CHALLENGES FETCHED SUCCESSFULLY!",
                success:true,
                challenges:sentChallenges
            },
            {
                status:200
            }
        )
    } catch (error) {
        
    }
}