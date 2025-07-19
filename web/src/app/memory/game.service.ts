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
