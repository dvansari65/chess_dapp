import prisma from "@/lib/prisma"


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