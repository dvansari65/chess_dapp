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
  pending,
  accepted,
  rejected,
  expired
}