
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
    challengerUserName:string
    challengerPubKey:string | undefined;
    opponentPubKey:string | null
  }

  const onlineUsers = new Map<string, string>()
  
  io.on("connect", (socket) => {
    socket.on("register-user",(data:ChallengeProps)=>{
        const {challengerPubKey,challengerUserName} = data
        if(challengerPubKey){
          onlineUsers.set(challengerPubKey,socket.id)
        }
        console.log(`user ${challengerUserName} is registered , pubkey ${challengerPubKey} ${socket.id}`)
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

 
   
  
    