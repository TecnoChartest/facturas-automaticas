import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Header } from './header/header';
import { AuthService } from '../auth/auth.service';

interface MenuOptions {
  label: string;
  subLabel: string;
  route: string;
  icon: string;
  action?: () => void;
}

@Component({
  selector: 'app-side-bar',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Header],
  templateUrl: './sideBar.html',
  styleUrl: './styles.css',
})
export default class SideBar {
  private authService = inject(AuthService);
  showLogoutModal = false;

  menuOptions: MenuOptions[] = [
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Estadisticas',
      subLabel: 'Estadisticas de facturas',
      route: '/dashboard/estadisticas',
    },
    {
      icon: 'fa-solid fa-upload',
      label: 'Subir Factura',
      subLabel: 'Obtener datos de facturas',
      route: '/dashboard/subir-factura',
    },
    {
      icon: 'fa-solid fa-file-invoice-dollar',
      label: 'Ver Facturas',
      subLabel: 'Visualizar facturas',
      route: '/dashboard/facturas',
    },
    {
      icon: 'fa-solid fa-user-group',
      label: 'Ver Clientes',
      subLabel: 'Visualizar clientes',
      route: '/dashboard/clientes',
    },
    {
      icon: 'fa-solid fa-arrow-right-from-bracket',
      label: 'Cerrar sesión',
      subLabel: '',
      route: '',
      action: () => (this.showLogoutModal = true),
    },
  ];

  onMenuItemClick(item: MenuOptions) {
    if (item.action) {
      item.action();
    }
  }

  async confirmLogout() {
    try {
      await this.authService.logout();
      this.showLogoutModal = false;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }
}
