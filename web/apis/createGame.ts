import { Game } from "@/types/game"
import { useMutation } from "@tanstack/react-query"

interface CreateGameVariables {
    challengeId:number;
    currentPlayerKey:string
}

export const createGameOffChain = ()=>{
    return useMutation<Game,Error,CreateGameVariables>({
        mutationKey:["offChainGame"],
        mutationFn:async({challengeId,currentPlayerKey}:CreateGameVariables)=>{
            try {
                const response = await fetch("/api/challenge/accept",{
                    method:"POST",
                    body:JSON.stringify({challengeId,currentPlayerKey})
                }) 
                const data = await response.json()
                if(!response.ok){
                    throw new Error(data.message || data.error || "something went wrong!")
                }
                return data;
            } catch (error:any) {
                console.error(error.message)
                throw error
            }
        }
    })
}