export interface Game {
  _id: string;
  name: string;
  players: { name: string; score: number }[];
  currentPlayer: string;
  cards: { value: string; flipped: boolean }[];
  matchedCards: string[];
  status: 'waiting' | 'in-progress' | 'finished';
}
