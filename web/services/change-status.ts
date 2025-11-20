import prisma from "@/lib/prisma"


export const RejectChallenge = async(id:number)=>{
    if(!id || typeof id !== "number"){
        throw new Error("challenge id not provided!")
    }
    try {
        
        const challenge = await prisma.challenge.update({
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
            throw new Error("Not able to Reject the challenge!")
        }
        return challenge.status
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