import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './presentation/layout/dashboardLayout/dashboardLayout.component';

export const routes: Routes = [
  // 🔹 Rutas de autenticación
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/register/register.component').then(m => m.RegisterComponent),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },

  // 🔹 Redirección inicial
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // 🔹 Layout principal con children (Dashboard / Facturas)
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        data: {
          title: 'Dashboard',
          icon: 'fa-solid fa-spell-check',
          description: 'Panel de usuario',
        },
      },
      {
        path: 'facturas',
        loadComponent: () =>
          import(
            './facturas/features/subir-facturas/subir-facturas.component'
          ).then((m) => m.SubirFacturasComponent),
        data: {
          title: 'Facturas',
          icon: 'fa-solid fa-file-invoice',
          description: 'Gestión de facturas',
        },
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./clientes/clientes.component').then((m) => m.ClientesComponent),
        data: { title: 'Clientes', icon: 'fa-solid fa-users', description: 'Gestión de clientes' },
      },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },

  // 🔹 Cualquier otra ruta → login
  { path: '**', redirectTo: 'auth/login' },
];
