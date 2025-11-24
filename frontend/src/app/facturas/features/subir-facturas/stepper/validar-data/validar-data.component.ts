import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'validar-data',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './validar-data.component.html',
  styleUrl: './validar-data.component.css',
})
export class ValidarDataComponent implements OnInit {
  @Input() jsonData: any;

  facturaData: any = {
    items: [],
  };

  ngOnInit(): void {
    if (this.jsonData && this.jsonData.output) {
      if (this.jsonData.output.items && Array.isArray(this.jsonData.output.items)) {
        this.facturaData.items = [...this.jsonData.output.items];
      } else {
        this.facturaData.items = [];
      }

      this.facturaData.id = this.jsonData.output.id || '';
      this.facturaData.fechaGeneracion = this.jsonData.output.fechaGeneracion || '';
      this.facturaData.fechaVencimiento = this.jsonData.output.fechaVencimiento || '';
      this.facturaData.totalBruto = this.jsonData.output.totalBruto || 0;
      this.facturaData.totalIva = this.jsonData.output.totalIva || 0;
      this.facturaData.totalPagar = this.jsonData.output.totalPagar || 0;
      this.facturaData.metodoPago = this.jsonData.output.metodoPago || '';
      this.facturaData.path = this.jsonData.output.path || 'ruta/archivo.pdf';
      this.facturaData.nombreCliente = this.jsonData.output.nombreCliente || '';
      this.facturaData.cedula = this.jsonData.output.cedula || '';
      this.facturaData.direccion = this.jsonData.output.direccion || '';
      this.facturaData.telefono = this.jsonData.output.telefono || '';
      this.facturaData.ciudad = this.jsonData.output.ciudad || '';
    }
  }

  agregarItem() {
    const newItemNumber = this.facturaData.items.length + 1;
    this.facturaData.items.push({
      item: newItemNumber.toString(),
      description: '',
      cantidad: '0',
    });
  }

  eliminarItem(index: number) {
    this.facturaData.items.splice(index, 1);
    this.facturaData.items.forEach((item: any, i: number) => {
      item.item = (i + 1).toString();
    });
  }

  getFormData(): any {
    return {
      ...this.facturaData,
    };
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
}
