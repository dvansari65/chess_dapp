import { useQuery } from "@tanstack/react-query"


export const GET = (publicKey:string)=>{
    return useQuery({
        queryKey:["recievedChallenge",publicKey],
        queryFn:async()=>{
            try {
                if(!publicKey){
                    throw new Error("Please provide public key!")
                }
                const response = await fetch("/api/challenge/received",{
                    method:"GET",
                    body:JSON.stringify(publicKey)
                })
                const data = await response.json();
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