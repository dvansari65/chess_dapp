import { PublicKey } from "@solana/web3.js";

export interface player {
  id: number | undefined;
  avatar: string | undefined;
  userName: string | undefined;
  lost: number;
  wins: number ;
  createdAt: string;
  rating: number ;
  solWon: number ;
  status : "Online" | "Offline",
  isPlaying:boolean,
  matchesPlayed:number ,
  publickey:PublicKey | null
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

