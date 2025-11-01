import { useMutation } from "@tanstack/react-query"


export const Register = ()=>{
    return useMutation({
        mutationKey:["register"],
        mutationFn:async({userName,avatar}:{userName:string,avatar:string})=>{
            try {
                const response = await fetch("/api/register",{
                    method:"POST",
                    body:JSON.stringify({userName,avatar}),
                    headers:{
                        "Content-Type":"application/json"
                    }
                })
                const data = await response.json()
                if(!response.ok){
                    throw new Error(data.message || "something went wrong!")
                }
                return data;
            } catch (error) {
                throw error;
            }
        }
    })
}