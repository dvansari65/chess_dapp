import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"


export const GET = async (req:NextRequest,{params}:{params:Promise<{publickey:string}>})=>{
    try {
        const publickey = (await params).publickey
        console.log("public key",publickey.toString())
        if(!publickey){
            return NextResponse.json(
                {
                    message:"Connect your wallet first!",
                    success:false,
                }
            )
        }
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
        const  challenges = await prisma.challenge.findMany({
            where:{
                AND:[
                    {
                        OR:[
                            {
                                receiverPubKey:publickey
                            },
                            {
                                senderPubKey:publickey
                            } 
                        ]
                    },
                    {
                        createdAt:{
                            gte: fiveMinutesAgo.toISOString()
                        }
                    }
                ]
            },
            orderBy:{
                createdAt:"desc"
            },
            select:{
                createdAt:true,
                receiverPubKey:true,
                senderPubKey:true,
                sender:{
                    select:{
                        id:true,
                        userName:true,
                        lost:true,
                        publickey:true,
                        createdAt:true,
                        wins:true,
                        matchesPlayed:true,
                        solWon:true,
                        rating:true,
                        isPlaying:true,
                        status:true
                    }
                },
                receiver:{
                    select:{
                        id:true,
                        userName:true,
                        lost:true,
                        publickey:true,
                        createdAt:true,
                        wins:true,
                        matchesPlayed:true,
                        solWon:true,
                        rating:true,
                        isPlaying:true,
                        status:true
                    }
                }
            }
        })
        console.log("challemges",challenges)
        if(!challenges || challenges.length === 0){
            return NextResponse.json(
                {
                    message:"No challenge found!",
                    challenges:[],
                    success:false
                },
                {status:404}
            )
        }
        return NextResponse.json(
            {
                message:"Challenges found successfully!",
                challenges,
                success:true
            },
            {status:200}
        )
    } catch (error:any) {
        return NextResponse.json(
            {
                error:error.message || "server error"
            },
            {status:500}
        )
    }
}