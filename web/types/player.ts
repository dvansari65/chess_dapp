import { PublicKey } from "@solana/web3.js";
import { amountValuesTypes } from "./escrow";

export interface player {
  id:            number | undefined;
  avatar:        string | undefined;
  userName:      string | undefined;
  lost:          number | undefined;
  wins:          number | undefined;
  createdAt:     string;
  rating:        number | undefined;
  solWon:        number | undefined ;
  status :       "online" | "offline",
  isPlaying:     boolean,
  matchesPlayed: number | undefined,
  publickey:     PublicKey | null
}

export interface getUserResponse {
  success: true,
  message: "user created successfully!",
  user:player,
  status:StatusCode
}
enum StatusCode {
  NotFound = 404,
  OK = 200,
  Created = 201
}

export interface getAllPlayersResponse {
  success:boolean;
  message:string;
  users:player[]
}

export interface SendChallengeProps {
  amount:amountValuesTypes
  currentPlayerStats: player | undefined;
  currentPlayerKey: string | undefined;  
  opponentPlayerKey: string | undefined;
}

export interface ReceiveChallenge {
  currentPlayerKey: string | undefined;  // ✅ Fixed typo: recieve -> Receive, consistent camelCase
  opponentPlayerStats: player | undefined;
  opponentPlayerKey: string | undefined;
  amount:amountValuesTypes
}