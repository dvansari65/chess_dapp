export interface player {
  id: number | undefined;
  avatar: string | undefined;
  userName: string | undefined;
  lost: number | null;
  wins: number | null;
  createdAt: string;
  rating: number | null;
  solWon: number | null;
  status : "online" | "offline",
  isPlaying:boolean,
  matchesPlayed:number | null
}

