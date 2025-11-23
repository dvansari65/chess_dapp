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


export const acceptChallenge = async(id:number)=>{
    if(!id || typeof id !== "number"){
        throw new Error("challenge id not provided!")
    }
    try {
        const challenge = await prisma.challenge.update({
            where:{
                id:id,
                expiresAt:{
                    gt:new Date()
                }
            },
            data:{
                status:"accepted"
            }
        })
        if(!challenge){
            throw new Error("Not able to Reject the challenge!")
        }
        return challenge.status
    } catch (error:any) {
        console.log("something went wrong!",error.message)
        throw error
    }
}