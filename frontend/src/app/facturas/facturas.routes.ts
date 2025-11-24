import { Routes } from '@angular/router';

export const FACTURAS_ROUTES: Routes = [
  {
    path: 'subir-facturas',
    loadComponent: () =>
      import('./features/subir-facturas/subir-facturas.component').then(
        m => m.SubirFacturasComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'subir-facturas',
    pathMatch: 'full',
  },
];
