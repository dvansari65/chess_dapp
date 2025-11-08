import { useMutation } from "@tanstack/react-query"


export const Register = ()=>{
    return useMutation({
        mutationKey:["register"],
        mutationFn:async({userName,publickey}:{userName:string,publickey:string})=>{
            try {
                const response = await fetch("/api/auth/register",{
                    method:"POST",
                    body:JSON.stringify({userName,publickey}),
                    headers:{
                        "Content-Type":"application/json"
                    }
                })
                const data = await response.json()
                if(!response.ok){
                    throw new Error(data?.error)
                }
                return data;
            } catch (error:any) {
                console.log("error",error.message)
                throw error;
            }
        }
    })
}