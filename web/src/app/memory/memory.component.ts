import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameService } from './game.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-memory',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './memory.component.html',
  styleUrl: './memory.component.css',
})
export class MemoryComponent {
  gameService = inject(GameService);

  name = '';

  onSubmit() {
    this.gameService.createGame(this.name).subscribe();
  }
}
