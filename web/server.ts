import { Server } from "socket.io";
import { createServer } from "http";
import { SendChallengeProps } from "./types/player";
import { createChallenge, updateUser } from "./services/service";
import {
  AcceptChallengeData,
  Challenge,
  RejectChallengeInputs,
} from "./types/challenge";
import { AcceptChallenge, RejectChallenge } from "./services/change-status";
import { StartGame } from "./types/game";


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

const onlineUsers = new Map<string, string>(); 

io.on("connect", (socket) => {
  console.log("socket started", socket.id);

  socket.on("register-user", async (data: RegisterUserProps) => {
    const { currentUserName, currentUserKey } = data;
    console.log("pubkey and username", currentUserKey, currentUserName);

    if (!currentUserKey) {
      socket.emit("error", { message: "Please provide user pubkey!" });
      return;
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
    socket.emit("successfully-register", {
      currentUserKey,
      currentUserName,
      isOnline: true,
    });

    try {
      await updateUser(currentUserKey, "Online");
      console.log(
        `User ${currentUserName} registered with pubkey ${currentUserKey}`
      );
    } catch (error: any) {
      io.to(socket.id).emit("error",{message:error?.message || "Failed to update user status!"})
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

        // Notify other users
        socket.broadcast.emit("user-offline", {
          currentUser: userKey,
          status: "Offline",
        });
      } catch (error: any) {
        console.error("Error updating user status:", error.message);
      }
    }
  });

  socket.on("send-challenge", async (data: SendChallengeProps) => {
    const { currentPlayerKey, opponentPlayerKey, currentPlayerStats, amount } =
      data;

    console.log("Challenge request received:", {
      from: currentPlayerKey,
      to: opponentPlayerKey,
      stats: currentPlayerStats,
      amount,
    });

    try {
      if (!currentPlayerKey || !opponentPlayerKey) {
        socket.emit("error", { message: "Missing player keys" });
        return;
      }

      if (!amount) {
        socket.emit("error", { message: "Amount is missing!" });
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

      if (opponentSocketId) {
        const challengeData = {
          currentPlayerKey: opponentPlayerKey,
          opponentPlayerStats: currentPlayerStats,
          opponentPlayerKey: currentPlayerKey,
          amount,
        };

        let challenge;
        try {
          challenge = await createChallenge({
            senderPublickey: currentPlayerKey,
            receiverPublicKey: opponentPlayerKey,
            amount,
          });
        } catch (error) {
          console.error(error);
          throw error;
        }

        if (!challenge) {
          socket.emit("error", { message: "challenge not created!" });
        }

        io.to(opponentSocketId).emit("recieve-challenge", challengeData);

        socket.emit("challenge-sent-successfully", {
          opponentPlayerKey,
          timestamp: Date.now(),
        });
      } else {
        socket.emit("opponent-offline", { opponentPlayerKey });
        console.log("Opponent is offline:", opponentPlayerKey);
      }
    } catch (error: any) {
      socket.emit("error", { message: error.message });
      console.error(" Error in send-challenge:", error);
    }
  });

  socket.on("reject-challenge", async (data: RejectChallengeInputs) => {

    const { challengeId, currentPlayerPubKey, opponentPlayerPubKey } = data;
    try {
      if (!challengeId || !currentPlayerPubKey || !opponentPlayerPubKey) {
        return;
      }
      if (currentPlayerPubKey === opponentPlayerPubKey) {
        throw new Error("current and opponent player are same!");
      }
      const challengeStatus = await RejectChallenge(challengeId);

      if (challengeStatus !== "rejected") {
        socket.emit("error", { message: "status not updated!" });
        return;
      }
      let opponentSocketId: string | undefined;

      console.log("=== ONLINE USERS MAP ===");
      for (const [socketID, pubKey] of onlineUsers.entries()) {
        console.log(`SocketID: ${socketID} -> PubKey: ${pubKey}`);
      }
      console.log("========================");

      for (const [socketID, pubKey] of onlineUsers.entries()) {
        if (opponentPlayerPubKey === pubKey) {
          opponentSocketId = socketID;
          break;
        }
      }
      if(socket.id === opponentSocketId){
        throw new Error("opponent player's socket id and current player's socket id are same!")
      }
      if (!opponentSocketId) {
        socket.emit("error", { message: "Opponent socket id not found!" });
        return;
      }
      if (socket?.id == opponentSocketId) {
        console.log(true);
      }
      io.to(opponentSocketId).emit("challenge-rejected", {
        opponentPlayerPubKey,
      });
      io.to(socket?.id).emit("successfully-rejected",{success:true})
    } catch (error: any) {
      socket.emit("error", { message: error.message });
      return;
    }
  });

  socket.on("accept-challenge", async (data: AcceptChallengeData) => {
    const { receiverPlayerKey, opponenentPlayerKey, challengeId,playerName } = data;

    if (!receiverPlayerKey || !opponenentPlayerKey || !challengeId || !playerName) {
      socket.emit("error", {
        message: "Reciever key or Opponent key or Challenge id,player name is missing!",
      });
      return;
    }

    let opponentSocketId: string | undefined;

    for (const [socketId, pubKey] of onlineUsers.entries()) {
      if (opponenentPlayerKey === pubKey) {
        opponentSocketId = socketId;
      }
    }
    if (opponentSocketId) {
      const gameId = await AcceptChallenge({
        challengeId,
        currentPlayerKey: receiverPlayerKey,
      });
      // / Emit to the OPPONENT (who was challenged)
      console.log("Challenge request accepted:", {
        whoAcceptedSocketId:socket.id,
        whoSentSocketId:opponentSocketId,
        from:receiverPlayerKey,
        to: opponenentPlayerKey,
      });

      io.to(opponentSocketId).emit("successfully-accepted", {
        opponentSocketId,
        currentPlayerPubKey: opponenentPlayerKey,
        opponenentPlayerKey: receiverPlayerKey,
        gameId,
        playerName
      });
      // confirm the game acceptance from the opponent who sent the challenge first!

    } else {
      io.to(socket.id).emit("user-offline", {
        opponenentPlayerKey,
        status: "Offline",
      });
    }
  });

  socket.on("start-game",(data:StartGame)=>{
    const {gameId,opponentSocketId,playerName,currentPlayerPubKey} = data
    
  })

  socket.on("disconnect", async () => {
    const currentUser = onlineUsers.get(socket.id);

    if (currentUser) {
      onlineUsers.delete(socket.id);
      socket.broadcast.emit("user-offline", {
        currentUser,
        status: "Offline",
      });

      console.log("User disconnected:", currentUser);

      try {
        await updateUser(currentUser, "Offline");
        console.log("Status updated to offline");
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    }

    console.log("🔌 Socket disconnected:", socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(` Socket.IO server running on PORT:${PORT}`); // FIXED
});
