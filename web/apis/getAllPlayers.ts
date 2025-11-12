
import { baseUrl } from "@/lib/URL"
import { getAllPlayersResponse, player } from "@/types/player"
import { useQuery } from "@tanstack/react-query"


export const getAllPlayers = ()=>{
    return useQuery<getAllPlayersResponse>({
        queryKey:["players"],
        queryFn:async()=>{
            try {
                const response = await fetch(`${baseUrl}/api/user`,{
                    method:"GET"
                })
                const data = await response.json()
                console.log("all players",data)
                if(!response.ok){
                    throw new Error(data.error || "something went wrong!")
                }
                return data;
            } catch (error) {
                throw error
            }
        }
    })
}