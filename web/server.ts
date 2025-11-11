
import  { Server } from "socket.io"
import { createServer } from "http"

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

  const onlineUsers = new Map<string | undefined, string>()
  
  io.on("connect", (socket) => {
    console.log("socket started",socket.id)
    socket.on("register-user",(data:RegisterUserProps)=>{
      console.log("event started")
        const {currentUserName,currentUserKey} = data
        console.log("pubkey and username",currentUserKey,currentUserName)
        if(!currentUserKey){
        throw new Error("Please provide challenger pubkey!")
        }
        onlineUsers.set(currentUserKey,socket.id)
        socket.emit("successfully-register",{currentUserKey,currentUserName})
        console.log(`user ${currentUserName} is registered , pubkey ${currentUserKey} ${socket.id}`)
    })
    socket.on("send-challenge",(data:ChallengeProps)=>{
      const {challengerPubKey,opponentPubKey} = data
      let opponentSocketID;
      if(challengerPubKey){
        opponentSocketID =  onlineUsers.get(opponentPubKey || "")
      }
      if(opponentSocketID){
        io.to(opponentSocketID).emit("recieved-challenge",data)
        console.log(`challenge send from ${challengerPubKey} to ${opponentPubKey}`)
      }else{
        socket.emit("opponent-offline",{opponentPubKey})
        console.log("opponent is offline!!!")
      }
    })
    socket.on("disconnect", async () => {
      console.log("socket disconnect")
    })
  })

  const PORT = 3001;
  server.listen(PORT, () => {
    console.log(`Socket.IO server running on PORT:${PORT}`);
  });

 
   
  
    