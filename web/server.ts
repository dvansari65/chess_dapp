
import  { Server } from "socket.io"
import { createServer } from "http"
import { player } from "./types/player";
import { updateUser } from "./services/service";

const server = createServer()

const io = new Server(server,{
  cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST"]
  }
})

  export interface ChallengeProps {
    challengerRating:number | undefined ;
    challengerWinsGames: number | undefined;
    challengerLostGames:number | undefined;
    challengerUserName:string | undefined
    challengerPubKey:string | undefined
    opponentPubKey:string | null
  }

interface RegisterUserProps {
  currentUserKey:string | undefined;
  currentUserName:string | undefined
}

 export interface SendChallengeProps {
  currentPlayerStats:player | undefined,
  currentPlayerkey : string | undefined,
  opponentPlayerKey: string | undefined
}

  const onlineUsers = new Map<string | undefined, string>()
  
  io.on("connect", (socket) => {
    console.log("socket started",socket.id)
    socket.on("register-user",async (data:RegisterUserProps)=>{
      console.log("event started")
        const {currentUserName,currentUserKey} = data
        console.log("pubkey and username",currentUserKey,currentUserName)
        if(!currentUserKey){
        throw new Error("Please provide challenger pubkey!")
        }
        onlineUsers.set(socket.id,currentUserKey)
        socket.emit("successfully-register",{currentUserKey,currentUserName,isOnline:true})
        try {
           await updateUser(currentUserKey,"Online")
        } catch (error:any) {
          console.error("user not updated!",error.message)
        }
        console.log(`user ${currentUserName} is registered , pubkey ${currentUserKey} ${socket.id}`)
    })

    socket.on("send-challenge",(data:SendChallengeProps)=>{
      console.log("challenge started..")
      const {currentPlayerkey,opponentPlayerKey} = data
      let opponentPubkey;
      if(opponentPlayerKey){
        opponentPubkey =  onlineUsers.get(socket.id || "")
      }
      if(opponentPubkey){
        io.to(opponentPubkey).emit("recieve-challenge",data)
        console.log(`challenge send from ${currentPlayerkey} to ${opponentPlayerKey}`)
      }else{
        socket.emit("opponent-offline",{opponentPlayerKey})
        console.log("opponent is offline!!!",opponentPlayerKey)
      }
    })
    socket.on("disconnect", async () => {
      const currentUser = onlineUsers.get(socket.id)
      if(currentUser){
        onlineUsers.delete(socket.id)
        socket.broadcast.emit("user-offline",{currentUser,status:"Offline"})
        console.log("status updated>>>")
        try {
          const updateduser = await updateUser(currentUser , "Offline")
          console.log("status",updateduser)
        } catch (error) {
          throw error;
        }
      }
      console.log("socket disconnect")
    })
  })

  const PORT = 3001;
  server.listen(PORT, () => {
    console.log(`Socket.IO server running on PORT:${PORT}`);
  });

 
   
  
    