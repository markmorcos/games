import { Component, inject } from '@angular/core';

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
  gameService = inject(GameService);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/memory']);
      return;
    }

    this.gameService.getGame(id).subscribe();
  }
}
