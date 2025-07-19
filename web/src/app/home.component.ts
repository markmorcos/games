import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  games = [
    {
      name: 'Memory',
      description: 'Test your memory by matching pairs of cards',
      route: '/memory',
    },
  ];
}
