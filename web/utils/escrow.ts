import { useQuery } from "@tanstack/react-query"
import { chessProgram } from "./chessProgram"
import { BN } from "@coral-xyz/anchor"
import { PublicKey, SystemProgram } from "@solana/web3.js"



export const getEscrowPda = (gameId:string)=>{
    const {program} = chessProgram()
    const [pda] = PublicKey.findProgramAddressSync([Buffer.from(gameId)],program.programId)
    return pda;
}


export const initializeEscrow = (gameId:string)=>{
    const {program} = chessProgram()
   
    return useQuery({
        queryKey:["create_escrow",gameId],
        queryFn:async()=>{
            try {
                if(!program.provider.publicKey){
                    throw new Error("Please connect your wallet first!")
                }
                const escrowPda = getEscrowPda(gameId)
                const data = await program.methods
                .initializeEscrow(
                    new BN(gameId)
                )
                .accounts({
                    escrow:escrowPda,
                    signer:program.provider.publicKey,
                    systemProgram:SystemProgram.programId
                })
                .rpc()
                console.log("escrow data",data)
                return data;
            } catch (error) {
                throw error;
            }
        }
    })
}