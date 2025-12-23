import prisma from "@/lib/prisma";
import { amountValuesTypes } from "@/types/escrow";
import { config } from "dotenv";
config();
interface createChallengeProps {
    senderPublickey: string | undefined;
    receiverPublicKey: string | undefined;
    createdAt?: string;
    amount: amountValuesTypes;
}

export const updateUser = async (
    publicKey: string | undefined,
    status: "Online" | "Offline"
) => {
    if (!publicKey) {
        throw new Error("Please provide publicKey!");
    }
    let updatedUser;
    try {
        if (status == "Online") {
            updatedUser = await prisma.player.update({
                where: {
                    publickey: publicKey.toString(),
                },
                data: {
                    status: "Online",
                },
            });
        } else {
            updatedUser = await prisma.player.update({
                where: {
                    publickey: publicKey.toString(),
                },
                data: {
                    status: "offline",
                },
            });
        }
        return updatedUser.status;
    } catch (error: any) {
        console.log(error.message);
        throw error;
    }
};

export const createChallenge = async ({
    senderPublickey,
    receiverPublicKey,
    amount,
}: createChallengeProps) => {
    if (!senderPublickey || !receiverPublicKey) {
        throw new Error("sender public key or reciever key is missing!");
    }
    if(!amount){
        throw new Error("Please provide amount first!")
    }
//    TODO:create class for challenge util methods and same for other schema table
    try {
        const challenge = await prisma.challenge.create({
            data: {
                senderPubKey: senderPublickey,
                receiverPubKey: receiverPublicKey,
                createdAt: new Date().toISOString(),
                amount:Number(amount),
                status:"pending",
                expiresAt:new Date(Date.now() + 5*60*1000)
            },
        });
        if (!challenge) {
            throw new Error("failed to create challenge!");
        }
       
        return challenge
    } catch (error) {
        throw error;
    }
};
