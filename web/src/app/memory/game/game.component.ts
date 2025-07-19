import { Component, DestroyRef, inject } from '@angular/core';

import { GameService } from '../game.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private gameService = inject(GameService);

  game = this.gameService.game;
  loading = this.gameService.loading;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/memory']);
      return;
    }

    const subscription = this.gameService.getGame(id).subscribe();

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
