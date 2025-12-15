import { CreateChallengeInputs } from "@/types/challenge"
import { useMutation } from "@tanstack/react-query"


export const sendChallenge = ()=>{
    return useMutation({
        mutationKey:["send-challenge"],
        mutationFn: async ({receiverPublicKey,senderPublickey,amount}:CreateChallengeInputs)=>{
            try {
                const response = await fetch("/api/challenge",{
                    method:"POST",
                    body:JSON.stringify({receiverPublicKey,senderPublickey,amount})
                })
                const data = await response.json()
                if(!response.ok){
                    throw new Error(data?.message || "Failed to send challenge!")
                }
                return data;
            } catch (error) {
                throw error;
            }
        }
    })
}