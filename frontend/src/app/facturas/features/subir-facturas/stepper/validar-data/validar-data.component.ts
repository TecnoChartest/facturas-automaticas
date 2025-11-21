import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'validar-data',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './validar-data.component.html',
  styleUrl: './validar-data.component.css',
})
// validar-data.component.ts
export class ValidarDataComponent {
  @Input() jsonData: any;

  // Datos del facturaData
  facturaData: any = {};

  ngOnInit(): void {
    if (this.jsonData && this.jsonData.output) {
      this.facturaData = {
        id: this.jsonData.output.id || '',
        productos: this.jsonData.output.productos || '',
        cantidad: this.jsonData.output.cantidad || '',
        fechaGeneracion: this.jsonData.output.fechaGeneracion || '',
        fechaVencimiento: this.jsonData.output.fechaVencimiento || '',
        totalBruto: this.jsonData.output.totalBruto || 0,
        totalIva: this.jsonData.output.totalIva || 0,
        totalPagar: this.jsonData.output.totalPagar || 0,
        metodoPago: this.jsonData.output.metodoPago || '',
        path: this.jsonData.output.path || 'ruta/archivo.pdf',
        nombreCliente: this.jsonData.output.nombreCliente || '',
        cedula: this.jsonData.output.cedula || '',
        direccion: this.jsonData.output.direccion || '',
        telefono: this.jsonData.output.telefono || '',
        ciudad: this.jsonData.output.ciudad || '',
      };
    }
  }

  getFormData(): any {
    return this.facturaData;
  }

  getClienteData(): any {
    return {
      cedula: this.facturaData.cedula || '',
      nombre_cliente: this.facturaData.nombreCliente || '',
      direccion: this.facturaData.direccion || '',
      telefono: this.facturaData.telefono || '',
      ciudad: this.facturaData.ciudad || '',
    };
  }

  // validar-data.component.ts
  // Mejorar los métodos de procesamiento de productos y cantidades
  getProductosArray(): string[] {
    if (!this.facturaData.productos) return [];

    return this.facturaData.productos
      .split(',')
      .map((p: string) => p.trim())
      .filter((p: string) => p !== ''); // Filtrar elementos vacíos
  }

  getCantidadesArray(): number[] {
    if (!this.facturaData.cantidad) return [];

    return this.facturaData.cantidad
      .split(',')
      .map((c: string) => {
        const cantidad = parseInt(c.trim(), 10);
        return isNaN(cantidad) ? 0 : cantidad; // Manejar NaN
      })
      .filter((c: number) => c > 0); // Filtrar cantidades inválidas
  }
}
