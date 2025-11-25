import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet,  } from '@angular/router';
import { Header } from './header/header';


interface MenuOptions {
  label: string;
  subLabel: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-side-bar',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Header],
  templateUrl: './sideBar.html',
})
export default class SideBar {
  menuOptions: MenuOptions[] = [
    {
      icon: 'fa-solid fa-spell-check',
      label: 'Estadisticas',
      subLabel: 'Estadisticas de facturas',
      route: '/dashboard/estadisticas'
    },

    {
      icon: 'fa-solid fa-spell-check',
      label: 'Subir Factura',
      subLabel: 'Obtener datos de facturas',
      route: '/dashboard/subir-factura'
    },

    {
      icon: 'fa-solid fa-spell-check',
      label: 'Ver Facturas',
      subLabel: 'Visualizar facturas',
      route: '/dashboard/facturas'
    },

    {
      icon: 'fa-solid fa-spell-check',
      label: 'Ver Clientes',
      subLabel: 'Visualizar clientes',
      route: '/dashboard/clientes'
    },
  ];
}
