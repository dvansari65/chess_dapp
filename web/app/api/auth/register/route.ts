
import { Prisma } from "@/generated/client";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
    let body;
    try {
        body = await req.json()
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid JSON in request body" },
            { status: 400 }
        );
    }
    try {
        const { userName, publickey } = body
        if (!userName) {
            throw new Error("Please provide user name!")
        }
        if (!publickey) {
            throw new Error("Please connect your wallet first!")
        }
        const user = await prisma.player.create({
            data: {
                userName: userName as string,
                publickey: publickey as string,
                createdAt: new Date().toISOString(),
                status:"Online"
            }
        })
        if (!user) {
            throw new Error("failed to generate user!")
        }
        return NextResponse.json(
            {
                success: true,
                message: "user created successfully!",
                user
            },
            {
                status: 200
            }
        )
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return NextResponse.json(
                    { success: false, error: "This wallet is already registered!" },
                    { status: 409 }
                );
            }
        }
        return NextResponse.json(
            {
                error: error.message || "server error!"
            },
            { status: 500 }
        )
    }
}