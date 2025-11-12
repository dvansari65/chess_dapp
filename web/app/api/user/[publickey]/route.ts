import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest, { params }: { params: Promise<{ publickey: string }> }) => {
    let publickey;
    try {
        publickey = (await params).publickey
        console.log("Fetching user for publickey:", publickey);
    } catch (error) {
        return NextResponse.json(
            {
                message: "Invalid param publickey!",
                success: false
            },
            {
                status: 400
            }
        )
    }
    try {
        if (!publickey || typeof publickey !== "string" || publickey.trim() == "") {
            throw new Error("Please provide publickey!")
        }
        const user = await prisma.player.findFirst({
            where: {
                publickey: publickey as string
            },
            select: {
                userName:true,
                rating:true,
                publickey:true,
                solWon:true,
                wins:true,
                lost:true,
                status:true,
                matchesPlayed:true,
                isPlaying:true,
                createdAt:true
            }
        })
        console.log("user",user)
        if (!user) {
            throw new Error("User not found!")
        }
        return NextResponse.json(
            {
                success: true,
                message: "success!",
                user
            },
            {
                status: 200
            }
        )
    } catch (error:any) {
        console.log("server error", error)
        return NextResponse.json(
            {
                error:error.message || "server error!",
                success:false
            },
            {
                status:500
            }
        )
    }
}