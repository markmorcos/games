import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { GameService } from './game.service';

export const GameIdGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const gameService = inject(GameService);

  const id = route.params['id'];

  return gameService
    .getGame(id)
    .pipe(map((game) => !!game || router.createUrlTree(['/memory'])));
};
