import { Routes } from '@angular/router';

export default [
  {
    path: 'subir-facturas',
    loadComponent: () => import('./features/subir-facturas/subir-facturas.component'),
  },

  {
    path: '**',
    redirectTo: 'subir-facturas',
    pathMatch: 'full',
  },
] as unknown as Routes;
