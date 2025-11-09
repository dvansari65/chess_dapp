
import { getAllPlayersResponse, player } from "@/types/player"
import { useQuery } from "@tanstack/react-query"


export const getAllPlayers = ()=>{
    return useQuery<getAllPlayersResponse>({
        queryKey:["players"],
        queryFn:async()=>{
            try {
                const response = await fetch("/api/user")
                const data = await response.json()
                if(!response.ok){
                    throw new Error(data.error || "something went wrong!")
                }
                console.log("users",data.users)
                return data;
            } catch (error) {
                throw error
            }
        }
    })
}