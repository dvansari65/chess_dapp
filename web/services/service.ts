import prisma from "@/lib/prisma"
import {config} from "dotenv"
config()
interface createChallengeProps {
    senderPublickey:string | undefined;
    receiverPublicKey:string | undefined;
    createdAt ?: string
}

export const updateUser = async(publicKey:string | undefined,status:"Online" | "Offline")=>{
    if(!publicKey){
        throw new Error("Please provide publicKey!")
    }
    let updatedUser;
    try {
        if(status == "Online"){
            updatedUser = await prisma.player.update({
                where:{
                    publickey:publicKey.toString()
                },
                data:{
                    status:"Online"
                }
            })
        }else {
            updatedUser = await prisma.player.update({
                where:{
                    publickey:publicKey.toString()
                },
                data:{
                    status:"offline"
                }
            })
        }
        return updatedUser.status;
    } catch (error:any) {
        console.log(error.message)
        throw error
    }
    
}


export const createChallenge = async({senderPublickey,receiverPublicKey}:createChallengeProps)=>{
    if(!senderPublickey || !receiverPublicKey){
        throw new Error("sender public key or reciever key is missing!")
    }
    try {
        const challenge = await prisma.challenge.create({
            data:{
                senderPubKey:senderPublickey,
                receiverPubKey:receiverPublicKey,
                createdAt:new Date().toISOString()
            },
            select:{
                sender:{
                    select:{
                        userName:true,
                        publickey:true,
                        matchesPlayed:true,
                        wins:true,
                        lost:true,
                        isPlaying:true,
                        rating:true,
                        createdAt:true,
                        status:true
                    }
                },
                receiver:{
                    select:{
                        publickey:true
                    }
                }
            }
        })
        if(!challenge){
            throw new Error("failed to create challenge!")
        }
        return challenge
    } catch (error) {
        throw error;
    }
}