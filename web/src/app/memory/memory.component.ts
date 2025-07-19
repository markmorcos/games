import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-memory',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './memory.component.html',
  styleUrl: './memory.component.css',
})
export class MemoryComponent {}
