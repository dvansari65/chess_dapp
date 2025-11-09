"use client"
import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

let socket:Socket | null = null

export const useSocket = ()=>{
    const [isConnected,setIsConnected] = useState(false)
    useEffect(()=>{
        socket = io({
            path:"/api/socket"
        })
        socket.on("connect",()=>{
            setIsConnected(true);
            console.log("connected to socket server!!",socket?.id)
        })
        socket.on("disconnect",()=>{
            setIsConnected(false);
            console.log("socket server disconnected!",socket?.id)
        })
        return ()=>{
            socket?.disconnect()
        }
    },[])
    return {
        socket,
        isConnected
    }
}