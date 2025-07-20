import { Component, inject } from '@angular/core';

import { GameService } from '../game.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css',
})
export class NewComponent {
  private router = inject(Router);
  private gameService = inject(GameService);

  loading = this.gameService.loading;

  name = '';

  onSubmit() {
    this.gameService.createGame(this.name).subscribe({
      next: (game) => {
        this.router.navigate(['/memory', game._id]);
      },
    });
  }
}
