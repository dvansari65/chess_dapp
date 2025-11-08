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
  // add other status codes as needed
}

