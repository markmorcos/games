import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  games = [
    {
      name: 'Memory',
      description: 'Test your memory by matching pairs of cards',
      route: '/memory',
    },
  ];
}
