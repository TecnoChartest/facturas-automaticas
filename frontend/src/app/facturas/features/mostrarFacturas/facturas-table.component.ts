import { Component, OnInit } from '@angular/core';
import { Factura, MostrarFactura } from './services/mostrarfacturas.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-facturas-table',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, CommonModule],
  templateUrl: './facturas-table.component.html',
  styleUrls: [],
})
export default class FacturasTableComponent implements OnInit {
  facturas: Factura[] = [];
  loading: boolean = true;
  selectedFile: string | null = null;
  showModal: boolean = false;

  constructor(private mostrarFactura: MostrarFactura) {}

  ngOnInit(): void {
    this.cargarFacturas();
  }

  cargarFacturas(): void {
    this.loading = true;
    this.mostrarFactura.getFacturas().subscribe({
      next: (data) => {
        this.facturas = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando facturas:', error);
        this.loading = false;
      },
    });
  }

  verArchivo(path: string): void {
    // El path ya debería ser el nombre del archivo, ej: "1764032636424-627090443.jpeg"
    const fullPath = `http://localhost:4000/${path}`;
    window.open(fullPath, '_blank');
  }

  // Alternativa: Modal para previsualización (más complejo pero mejor UX)
  previsualizarArchivo(path: string): void {
    this.selectedFile = `http://localhost:4000/${path}`;
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.selectedFile = null;
  }
}
