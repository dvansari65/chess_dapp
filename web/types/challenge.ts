import { player } from "./player";

export interface GetAllChallengesResponse {
  success: boolean;
  message: string;
  challenges: Challenge[];
}

export interface Challenge {
  amount:number | undefined;
  status:ChallengeStatus;
  id: number | undefined;
  senderPubKey: string | undefined;
  receiverPubKey: string | undefined;
  sender: player | undefined;
  receiver: player | undefined;
  createdAt: string;
}

export interface RejectChallengeInputs {
  challengeId:number | undefined , 
  currentPlayerPubKey:string | undefined ,
  opponentPlayerPubKey: string  | undefined
}

export enum ChallengeStatus {
  pending = "pending",
  accepted = "accepted",
  rejected = "rejected",
  expired = "expired"
}

export interface SentChallenges {
  success:boolean,
  message: string | undefined,
  challenges:Challenge[]
}

export interface AcceptChallengeData {
  receiverPlayerKey:string ;
  opponenentPlayerKey:string;
  challengeId:number;
  playerName?:string
}

//props for successfull accept challenge
export interface SuccesfulAcceptChallenge {
  receiverPlayerKey:string ;
  opponenentPlayerKey:string;
  gameId:number
}