
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export const POST = async(req:NextRequest)=>{
    try {
        const body = await req.json()
        const {userName,publickey} = body
        if(!userName){
            throw new Error("Please provide user name!")
        }
        if(!publickey){
            throw new Error("Please connect your wallet first!")
        }
        const user = await prisma.player.create({
            data:{
                userName:userName as string,
                publickey:publickey as string,
                createdAt:new Date().toISOString()
            }
        })
        if(!user){
            throw new Error("failed to generate user!")
        }
        return NextResponse.json({
            message:"user created successfully!",
            user
        })
    } catch (error:any) {
        return NextResponse.json(
            {
                error:error.message || "server error!"
            },
            {status:500}
        )
    }
}