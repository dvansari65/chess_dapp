import { Server } from "socket.io";
import { createServer } from "http";
import { player, SendChallengeProps } from "./types/player";
import { createChallenge, updateUser } from "./services/service";
import { Challenge } from "./types/challenge";

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

    // Remove any existing socket for this pubkey (prevents duplicates)
    for (const [existingSocketId, pubKey] of onlineUsers.entries()) {
      if (pubKey === currentUserKey && existingSocketId !== socket.id) {
        onlineUsers.delete(existingSocketId);
        console.log(
          `🔄 Removed old socket ${existingSocketId} for pubkey ${currentUserKey}`
        );
        break;
      }
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
      console.log(
        `User ${currentUserName} registered with pubkey ${currentUserKey}`
      );
    } catch (error: any) {
      console.error("user not updated!", error.message);
    }
  });
  
  socket.on("unregister-user", async (data: { userKey: string }) => {
    const { userKey } = data;
    console.log("🔴 Unregistering user:", userKey);
    
    if (!userKey) {
      return;
    }
    
    // Find and remove all sockets for this user
    let removedCount = 0;
    for (const [socketId, pubKey] of onlineUsers.entries()) {
      if (pubKey === userKey) {
        onlineUsers.delete(socketId);
        removedCount++;
        console.log(`Removed socket ${socketId} for user ${userKey}`);
      }
    }
    
    if (removedCount > 0) {
      try {
        await updateUser(userKey, "Offline");
        console.log(`✅ User ${userKey} set to Offline`);
        
        // Notify other users
        socket.broadcast.emit("user-offline", { 
          currentUser: userKey, 
          status: "Offline" 
        });
      } catch (error: any) {
        console.error("❌ Error updating user status:", error.message);
      }
    }
  });

  socket.on("send-challenge", async (data: SendChallengeProps) => {
    const { currentPlayerKey, opponentPlayerKey, currentPlayerStats,amount } = data;
    console.log("📤 Challenge request received:", {
      from: currentPlayerKey,
      to: opponentPlayerKey,
      stats: currentPlayerStats,
      amount
    });


    try {
      if (!currentPlayerKey || !opponentPlayerKey) {
        socket.emit("error", { message: "Missing player keys" });
        return;
      }
      if(!amount){
        socket.emit("error", { message: "Amount is missing!" });
        return;
      }

      console.log("amount recieved",amount)

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
        onlineUsersCount: onlineUsers.size,
      });

      if (opponentSocketId) {
        const challengeData = {
          currentPlayerKey: opponentPlayerKey,
          opponentPlayerStats: currentPlayerStats,
          opponentPlayerKey: currentPlayerKey,
          amount
        };

        let challenge;
        try {
          challenge = await createChallenge({
            senderPublickey: currentPlayerKey,
            receiverPublicKey: opponentPlayerKey,
            amount
          });
        } catch (error) {
          console.error(error);
          throw error
        }

        console.log("created challenge", challenge);

        if (!challenge) {
          socket.emit("error", { message: "challenge not created!" });
        }

        io.to(opponentSocketId).emit("recieve-challenge", challengeData);

        if (!challenge) {
          throw new Error("challenge not created in DB");
        }
  
        socket.emit("challenge-sent-successfully", {
          opponentPlayerKey,
          timestamp: Date.now(),
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
        status: "Offline",
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
