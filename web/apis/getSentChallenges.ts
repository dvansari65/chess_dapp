import { SentChallenges } from "@/types/challenge"
import { useQuery } from "@tanstack/react-query"


export const getSentChallenges = async ({publicKey}:{publicKey:string})=>{
    return useQuery<SentChallenges>({
        queryKey:["sentChallenges"],
        queryFn:async ()=>{
            try {
                const response = await fetch("/api/challenge/sent",{
                    method:"GET",
                    body:JSON.stringify(publicKey)
                })
                const data = await response.json()
                if(!response.ok){
                    throw new Error(data.message || data.error || "Something went wrong!")
                }
                return data;
            } catch (error) {
                throw error;
            }
        }
    })
}