import { routes } from '../../../app.routes';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarMenuItemComponent } from '../sidebarMenuItem/sidebarMenuItem.component';
import { DashboardLayoutComponent as LayoutComp } from './dashboardLayout.component'; // solo si hace falta el tipo

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarMenuItemComponent,
  ],
  templateUrl: './dashboardLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {

  // Busca la ruta cuyo component sea DashboardLayoutComponent
  public routes = routes.find(r => r.component === LayoutComp)?.children?.filter(r => r.data) || [];

}
