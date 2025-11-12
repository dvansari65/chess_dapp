import { GetAllChallengesResponse } from "@/types/challenge"
import { useQuery } from "@tanstack/react-query"



export const getAllChallenges =  (publickey:string | undefined) => {
    return useQuery<GetAllChallengesResponse>({
        queryKey:["challenges",publickey],
        queryFn:async()=>{
            try {
                if(!publickey){
                    throw new Error("Please connect your wallet")
                }
                console.log("pub key",publickey)
                const convertedKey = publickey.toString()
                const response = await fetch(`/api/challenge/${convertedKey}`,{
                    method:"GET"
                })
                const data = await response.json()
                console.log("resposne",data)
                if(!response.ok){
                    throw new Error(data?.message || data?.error || "something went wrong!!")
                }
                console.log("data challenge",data)
                return data
            } catch (error) {
                throw error
            }
        }
    })
}