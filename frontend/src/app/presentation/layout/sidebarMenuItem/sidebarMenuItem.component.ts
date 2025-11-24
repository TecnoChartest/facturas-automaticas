import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ importar CommonModule

@Component({
  selector: 'app-sidebar-menu-item',
  standalone: true,
  imports: [RouterModule, CommonModule], // ✅ agregar CommonModule
  template: `
    <a
      [routerLink]="path"
      routerLinkActive="bg-gray-800"
      [routerLinkActiveOptions]="{ exact: true }"
      class="flex items-center hover:bg-gray-800 rounded-md p-2 transition-colors"
    >
      <i class="{{ icon }} text-2xl mr-4 text-indigo-400"></i>
      <div class="flex flex-col flex-grow">
        <span
          [ngClass]="{
            'text-white': isActive(path),
            'text-gray-900': !isActive(path)
          }"
          class="text-lg font-semibold transition-colors"
        >
          {{ title }}
        </span>
        <span class="text-gray-400 text-sm">{{ description }}</span>
      </div>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMenuItemComponent {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input({ required: true }) path!: string;

  isActive(path: string): boolean {
    return location.pathname.includes(path);
  }
}
