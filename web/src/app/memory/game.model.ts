export interface Game {
  id: string;
  name: string;
  players: string[];
  currentPlayer: string;
  cards: string[];
  matchedCards: string[];
  status: 'waiting' | 'in-progress' | 'finished';
}
