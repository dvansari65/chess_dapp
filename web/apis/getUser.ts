import { getUserResponse } from "@/types/player"
import { PublicKey } from "@solana/web3.js"
import { useQuery } from "@tanstack/react-query"



export const getPlayer = (publickey:PublicKey | null)=>{
    return useQuery<getUserResponse>({
        queryKey:["player",publickey],
        queryFn:async()=>{
            try {
                const convertedKey = publickey?.toString()
                const response = await fetch(`/api/user/${convertedKey}`)
                const data = await response.json()
                if(!response.ok){
                    throw new Error(data.error || "failed to fetch player!")
                }
                console.log("player data",data)
                return data;
            } catch (error:any) {
                console.log(error.message)
                throw error
            }
        }
    })
}