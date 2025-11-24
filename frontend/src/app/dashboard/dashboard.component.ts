import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-dashboard.component',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export default class DashboardComponent {
  // URL pública de Metabase
  private metabaseUrl =
    `${environment.CONSUMIR_METABASE}`;
  safeIframeUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Sanitizar la URL para que Angular la considere segura
    this.safeIframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.metabaseUrl);
    console.log('Dashboard URL sanitized:', this.metabaseUrl);
  }

  ngOnDestroy(): void {
    // Limpieza si es necesaria
  }
}
