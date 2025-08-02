import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

import { Game } from './game.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GameService {
  private httpClient = inject(HttpClient);

  loading = signal(false);
  game = signal<Game | null>(null);

  addPlayer(playerName: string | null): void {
    this.game.update((game) => {
      if (
        !game ||
        !playerName ||
        game.players.some((player) => player.name === playerName)
      )
        return game;
      return {
        ...game,
        players: Array.from(
          new Set([...game.players, { name: playerName, score: 0 }])
        ),
      };
    });
  }

  removePlayer(playerName: string): void {
    this.game.update((game) => {
      if (!game) return game;
      return {
        ...game,
        players: game.players.filter((player) => player.name !== playerName),
      };
    });
  }

  startGame(): void {
    this.game.update((game) => {
      if (!game) return game;
      return {
        ...game,
        status: 'in-progress',
        currentPlayer: game.players[0].name,
      };
    });
  }

  flipCard(cardIndex: number): void {
    this.game.update((game) => {
      if (!game) return game;
      return {
        ...game,
        cards: game.cards.map((card, idx) =>
          idx === cardIndex ? { ...card, flipped: !card.flipped } : card
        ),
      };
    });
  }

  matchCard(cardValue: string): void {
    this.game.update((game) => {
      if (!game) return game;
      return {
        ...game,
        players: game.players.map((player) => ({
          ...player,
          score:
            player.name === game.currentPlayer
              ? player.score + 1
              : player.score,
        })),
        matchedCards: Array.from(new Set([...game.matchedCards, cardValue])),
      };
    });
  }

  nextTurn(playerName: string): void {
    this.game.update((game) => {
      if (!game) return game;
      const currentIndex = game.players.findIndex(
        (player) => player.name === playerName
      );
      const nextIndex = (currentIndex + 1) % game.players.length;
      return { ...game, currentPlayer: game.players[nextIndex].name };
    });
  }

  setTurn(playerName: string): void {
    this.game.update((game) => {
      if (!game) return game;
      return { ...game, currentPlayer: playerName };
    });
  }

  finishGame(): void {
    this.game.update((game) => {
      if (!game) return game;
      return { ...game, status: 'finished' };
    });
  }

  createGame(name: string): Observable<Game> {
    this.loading.set(true);
    return this.httpClient
      .post<Game>(`${environment.apiUrl}/memory/games`, {
        name,
      })
      .pipe(
        tap({
          next: () => this.loading.set(false),
          error: () => this.loading.set(false),
        })
      );
  }

  getGame(id: string): Observable<Game | null> {
    this.loading.set(true);
    return this.httpClient
      .get<Game>(`${environment.apiUrl}/memory/games/${id}`)
      .pipe(
        tap({
          next: (game) => {
            this.loading.set(false);
            this.game.set(game);
          },
          error: () => {
            this.loading.set(false);
            this.game.set(null);
          },
        }),
        catchError(() => {
          this.loading.set(false);
          return of(null);
        })
      );
  }
}
