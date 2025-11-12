import { Server } from "socket.io";
import { createServer } from "http";
import { player, SendChallengeProps } from "./types/player";
import { createChallenge, updateUser } from "./services/service";

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

export interface ChallengeProps {
  challengerRating: number | undefined;
  challengerWinsGames: number | undefined;
  challengerLostGames: number | undefined;
  challengerUserName: string | undefined;
  challengerPubKey: string | undefined;
  opponentPubKey: string | null;
}

export interface RegisterUserProps {
  currentUserKey: string | undefined;
  currentUserName: string | undefined;
}

const onlineUsers = new Map<string, string>(); // ✅ Changed to Map<string, string>

io.on("connect", (socket) => {
  console.log("socket started", socket.id);
  
  socket.on("register-user", async (data: RegisterUserProps) => {
    const { currentUserName, currentUserKey } = data;
    console.log("pubkey and username", currentUserKey, currentUserName);
    
    if (!currentUserKey) {
      socket.emit("error", { message: "Please provide user pubkey!" });
      return; // ✅ Use return instead of throw
    }
    
    onlineUsers.set(socket.id, currentUserKey);
    const userPubKey = onlineUsers.get(socket.id);
    console.log("obtained pub key", userPubKey);
    
    socket.emit("successfully-register", {
      currentUserKey,
      currentUserName,
      isOnline: true,
    });
    
    try {
     const userStatus = await updateUser(currentUserKey, "Online");
      console.log(`User ${currentUserName} registered with pubkey ${currentUserKey}`);
    } catch (error: any) {
      console.error("user not updated!", error.message);
    }
  });
  
  socket.on("send-challenge", async (data: SendChallengeProps) => {
    const { currentPlayerKey, opponentPlayerKey, currentPlayerStats } = data;
    console.log("📤 Challenge request received:", {
      from: currentPlayerKey,
      to: opponentPlayerKey,
      stats: currentPlayerStats
    });
    
    try {
      if (!currentPlayerKey || !opponentPlayerKey) {
        socket.emit("error", { message: "Missing player keys" });
        return;
      }
      
      let opponentSocketId: string | undefined;
      
      // Find opponent's socket ID
      for (const [socketId, pubKey] of onlineUsers.entries()) {
        if (pubKey === opponentPlayerKey) {
          opponentSocketId = socketId;
          break;
        }
      }
      
      console.log("🔍 Opponent socket lookup:", {
        opponentKey: opponentPlayerKey,
        foundSocketId: opponentSocketId,
        onlineUsersCount: onlineUsers.size
      });
      
      if (opponentSocketId) {
        // ✅ Send challenge with proper structure
        const challengeData = {
          currentPlayerKey: opponentPlayerKey,
          opponentPlayerStats: currentPlayerStats,
          opponentPlayerKey: currentPlayerKey
        };
        
        console.log("📨 Emitting challenge to opponent:", challengeData);
        io.to(opponentSocketId).emit("recieve-challenge", challengeData);
        
        // Create challenge in database
        const challenge = await createChallenge({
          senderPublickey: currentPlayerKey,
          receiverPublicKey: opponentPlayerKey,
        });
        
        if (!challenge) {
          throw new Error("challenge not created in DB");
        }
        
        // ✅ Confirm to sender
        socket.emit("challenge-sent-successfully", {
          opponentPlayerKey,
          timestamp: Date.now()
        });
        
        console.log("✅ Challenge sent successfully to:", opponentPlayerKey);
      } else {
        socket.emit("opponent-offline", { opponentPlayerKey });
        console.log("❌ Opponent is offline:", opponentPlayerKey);
      }
    } catch (error: any) {
      socket.emit("error", { message: error.message });
      console.error("❌ Error in send-challenge:", error);
    }
  });
  
  socket.on("disconnect", async () => {
    const currentUser = onlineUsers.get(socket.id);
    
    if (currentUser) {
      onlineUsers.delete(socket.id);
      socket.broadcast.emit("user-offline", { 
        currentUser, 
        status: "Offline" 
      });
      
      console.log("👋 User disconnected:", currentUser);
      
      try {
        await updateUser(currentUser, "Offline");
        console.log("✅ Status updated to offline");
      } catch (error) {
        console.error("❌ Error updating user status:", error);
      }
    }
    
    console.log("🔌 Socket disconnected:", socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on PORT:${PORT}`); // ✅ FIXED
});