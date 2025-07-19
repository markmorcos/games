import { Component, inject } from '@angular/core';

import { GameService } from '../game.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css',
})
export class NewComponent {
  gameService = inject(GameService);

  name = '';

  onSubmit() {
    this.gameService.createGame(this.name).subscribe();
  }
}
