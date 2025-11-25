import { Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['/dashboard']);

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/auth.component').then((m) => m.AuthComponent),
    ...canActivate(redirectLoggedInToDashboard),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./sideBar/sideBar'),
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      {
        path: 'estadisticas',
        loadComponent: () => import('./dashboard/dashboard.component'),
      },
      {
        path: 'subir-factura',
        loadComponent: () => import('./facturas/features/subir-facturas/subir-facturas.component'),
      },
      {
        path: 'facturas',
        loadComponent: () => import('./facturas/features/mostrarFacturas/facturas-table.component'),
      },
      {
        path: 'clientes',
        loadComponent: () => import('./clientes/clientes.component'),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
