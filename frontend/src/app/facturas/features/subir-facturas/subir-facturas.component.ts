import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SubirFacturaService } from '../../services/subir-factura.service';

@Component({
  selector: 'app-subir-facturas.component',
  imports: [ReactiveFormsModule],
  templateUrl: './subir-facturas.component.html',
  styleUrl: './subir-facturas.component.css',
})
export default class SubirFacturasComponent {
  selectedFile: File | null = null;

  subirFacturaForm: FormGroup;
  factura: FormControl;

  constructor(public subirFactura: SubirFacturaService) {
    this.factura = new FormControl();
    this.subirFacturaForm = new FormGroup({ factura: this.factura });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  postFactura() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('data', this.selectedFile);

      this.subirFactura.postFactura(formData).subscribe(
        (response) => console.log('Respuesta del servidor:', response),
        (error) => console.error('Error al subir el archivo:', error)
      );
    } else {
      console.warn('No hay archivo seleccionado.');
    }
  }
}
