import { Routes } from '@angular/router';

import { MemoryComponent } from './memory.component';
import { GameIdGuard } from './game-id.guard';
import { GameFinishedGuard } from './game-finished.guard';

export const memoryRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./memory.component').then((m) => m.MemoryComponent),
    children: [
      {
        path: ':id',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./game/game.component').then((m) => m.GameComponent),
            canActivate: [GameIdGuard],
          },
          {
            path: 'leaderboard',
            loadComponent: () =>
              import('./leaderboard/leaderboard.component').then(
                (m) => m.LeaderboardComponent
              ),
            canActivate: [GameFinishedGuard],
          },
        ],
      },
    ],
  },
];
