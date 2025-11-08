import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export const GET = async(req:NextRequest,{params}:{params:Promise<{publickey:string}>})=>{
    try {
        const publickey = (await params).publickey
        if(!publickey){
            throw new Error("Please provide publickey!")
        }
        const user = await prisma.player.findUnique({
            where:{
                publickey:publickey as string
            },
            select:{
                userName:true
            }
        })
        if(!user){
            throw new Error("User not found!")
        }
        return NextResponse.json({
            message:"success!",
            user
        })
    } catch (error) {
        console.log("server error",error)
        throw error;
    }
}