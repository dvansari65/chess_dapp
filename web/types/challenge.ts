import { player } from "./player";

export interface GetAllChallengesResponse {
  success: boolean;
  message: string;
  challenges: Challenge[];
}

export interface Challenge {
  amount:number | undefined
  id: number | undefined;
  senderPubKey: string | undefined;
  receiverPubKey: string | undefined;
  sender: player | undefined;
  receiver: player | undefined;
  createdAt: string;
}
