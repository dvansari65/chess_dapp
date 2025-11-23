

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
  
  enum GameStatus {
    pending="pending",
    waitingForOnChainGameId="waitingForOnChainGameId",
    draw="draw",
    finished="finished"
  }