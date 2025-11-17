import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'validar-data',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './validar-data.component.html',
  styleUrl: './validar-data.component.css',
})
export class ValidarDataComponent {
  @Input() jsonData: any;

  // Datos del formulario
  facturaData: any = {};

  ngOnInit(): void {
    // Inicializar datos del formulario con jsonData
    if (this.jsonData && this.jsonData.output) {
      this.facturaData = {
        id: this.jsonData.output.id || '',
        productos: this.jsonData.output.productos || '',
        fechaGeneracion: this.jsonData.output.fechaGeneracion || '',
        fechaVencimiento: this.jsonData.output.fechaVencimiento || '',
        totalBruto: this.jsonData.output.totalBruto || 0,
        totalIva: this.jsonData.output.totalIva || 0,
        totalPagar: this.jsonData.output.totalPagar || 0,
        metodoPago: this.jsonData.output.metodoPago || '',
        path: this.jsonData.output.path || 'ruta/archivo.pdf', // Ajusta según necesites
        nombreCliente: this.jsonData.output.nombreCliente || '',
        cedula: this.jsonData.output.cedula || '',
        direccion: this.jsonData.output.direccion || '',
        telefono: this.jsonData.output.telefono || '',
        ciudad: this.jsonData.output.ciudad || '',
      };
    }
  }

  // Método para obtener los datos actualizados del formulario
  getFormData(): any {
    return this.facturaData;
  }
}
