import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'memory',
    loadChildren: () =>
      import('./memory/memory.routes').then((m) => m.memoryRoutes),
  },
];
