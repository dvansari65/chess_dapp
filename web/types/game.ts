

export interface Game {
    id: number;
    onChainGameId: number | null;
    player1PubKey: string;
    player2PubKey: string;
    status: GameStatus;
    wageredAmount: number;
    createdAt: Date;
    finishedAt: Date | null;
  }
  export interface CreateGameOffChainResponse {
    game:Game;
    success:boolean;
    message:string
  }
  enum GameStatus {
    pending="pending",
    waitingForOnChainGameId="waitingForOnChainGameId",
    draw="draw",
    finished="finished"
  }

  export interface CreateGameVariables {
    challengeId:number;
    currentPlayerKey:string,
    opponenentPlayerKey:string
}

export interface GameConfirmData {
  currentPlayerPubKey: string,
  gameId: number
  currentPlayerSocketId:string,
  opponenentPlayerKey:string,
  opponentSocketId: string,
  playerName:string
}

export interface StartGame {
  gameId: number,
  opponentSocketId: string,
  currentPlayerPubKey: string,
  playerName:string
}
