import { useQuery } from "@tanstack/react-query"



export const getPlayer = (publickey:string)=>{
    return useQuery({
        queryKey:["player",publickey],
        queryFn:async()=>{
            try {
                const response = await fetch(`/api/user/${publickey}`)
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