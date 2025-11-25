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

  eliminarFactura(id: number): void {
    if (
      confirm('¿Está seguro de que desea eliminar esta factura? Esta acción no se puede deshacer.')
    ) {
      this.mostrarFactura.eliminarFactura(id).subscribe({
        next: () => {
          alert('Factura eliminada exitosamente');
          this.cargarFacturas();
        },
        error: (error) => {
          console.error('Error eliminando factura:', error);
          alert('Error al eliminar la factura');
        },
      });
    }
  }

  editarFactura(factura: Factura): void {
    const nuevoMetodoPago = prompt('Nuevo método de pago:', factura.metodoPago);

    if (nuevoMetodoPago !== null) {
      const datosActualizados = {
        metodoPago: nuevoMetodoPago,
      };

      this.mostrarFactura.actualizarFactura(factura.id, datosActualizados).subscribe({
        next: () => {
          alert('Factura actualizada exitosamente');
          this.cargarFacturas(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error actualizando factura:', error);
          alert('Error al actualizar la factura');
        },
      });
    }
  }

  verArchivo(path: string): void {
    const fullPath = `http://localhost:4000/${path}`;
    window.open(fullPath, '_blank');
  }

  previsualizarArchivo(path: string): void {
    this.selectedFile = `http://localhost:4000/${path}`;
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.selectedFile = null;
  }
}
