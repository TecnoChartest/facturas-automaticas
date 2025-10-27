import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './presentation/layout/dashboardLayout/dashboardLayout.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component'),
        data: {
          icon: 'fa-solid fa-spell-check',
          title: 'Dashboard',
          description: 'Panel de usuario',
        },
      },
      {
        path: 'facturas',
        loadChildren: () => import('./facturas/facturas.routes'),
        data: {
          icon: 'fa-solid fa-spell-check',
          title: 'Facturas',
          description: 'Gestión de facturas',
        },
      },
      {
        path: '**',
        redirectTo: 'facturas',
        pathMatch: 'full',
      },
    ],
  },
];
