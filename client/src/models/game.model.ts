export interface Player {
  sessionId: string;
  name: string;
  lives: number;
  cards: string[];
  isHost: boolean;
  isReady: boolean;
  response: string;
}

export interface GameRoom {
  players: Record<string, Player>;
  roundMasterId: string;
  proposition: string;
  roundState: "waiting_for_players" | "propose_phase" | "choice_phase";
}

export interface PlayerResponse {
  playerId: string;
  response: string;
}
