import { NextRequest } from "next/server";


export const POST = async(req:NextRequest)=>{
    try {
        const body = await req.json()
        const {username,p} = body
    } catch (error) {
        
    }
}