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
                console.log("register user data",data)
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