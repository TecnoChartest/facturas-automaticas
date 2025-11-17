import { ChangeDetectorRef, Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SubirFacturaService } from '../../../services/subir-factura.service';
import { CommonModule } from '@angular/common';
import { ValidarDataComponent } from './validar-data/validar-data.component';
import { SubirFacturaPg } from '../../../services/subir-factura-pg.service';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ValidarDataComponent],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css',
})
export class StepperComponent implements OnInit {
  @ViewChild(ValidarDataComponent) validarDataComponent!: ValidarDataComponent;
  @Output() jsonData_n8n: any;
  selectedFile: File | null = null;
  currentStep: number = 1;
  procesamientoResultado: any = null;
  isLoading: boolean = false;

  subirFacturaForm: FormGroup;
  factura: FormControl;

  constructor(
    public subirFactura: SubirFacturaService,
    private cdRef: ChangeDetectorRef,
    private subirFacturaPG: SubirFacturaPg
  ) {
    this.factura = new FormControl();
    this.subirFacturaForm = new FormGroup({ factura: this.factura });
  }

  ngOnInit(): void {
    // Inicialización si es necesaria
  }

  onFileSelected(event: any): void {
    const files: FileList | null = event.target.files;

    if (files && files.length > 0) {
      const file: File = files[0];

      // Validar tipo de archivo
      const fileType = file.type;
      const isValidType = fileType.startsWith('image/') || fileType === 'application/pdf';

      if (isValidType) {
        this.selectedFile = file;
      } else {
        alert('Por favor, selecciona un archivo de imagen o PDF válido.');
        event.target.value = ''; // Limpiar el input
        this.selectedFile = null;
      }
    } else {
      this.selectedFile = null;
    }
  }

  onNextStep(): void {
    if (this.currentStep === 1) {
      if (this.selectedFile) {
        this.currentStep = 2;
        this.procesarFactura(); // Inicia el procesamiento automáticamente
      }
    } else if (this.currentStep === 2) {
      // Solo permite avanzar si ya tenemos la respuesta
      if (this.procesamientoResultado) {
        this.currentStep = 3;
      }
    } else if (this.currentStep === 3) {
      this.currentStep = 4;
    }
  }

  onPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  procesarFactura(): void {
    if (this.selectedFile) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('data', this.selectedFile);

      this.subirFactura.postFactura(formData).subscribe(
        (response) => {
          this.procesamientoResultado = response;
          this.jsonData_n8n = response; // Asigna los datos para el componente hijo
          this.isLoading = false;

          // Avanza automáticamente al paso 3 cuando se complete el procesamiento
          this.currentStep = 3;
          this.cdRef.detectChanges();
        },
        (error) => {
          console.error('Error al subir el archivo:', error);
          this.isLoading = false;
          alert('Error al procesar la factura. Por favor, intenta nuevamente.');
          // Opcional: regresar al paso 1 en caso de error
          this.currentStep = 1;
        }
      );
    }
  }

  // Método para obtener el nombre del archivo de forma segura
  getFileName(): string {
    return this.selectedFile ? this.selectedFile.name : 'Ningún archivo seleccionado';
  }

  // Verificar si podemos avanzar al siguiente paso
  canProceedToNextStep(): boolean {
    if (this.currentStep === 1) {
      return this.selectedFile !== null;
    } else if (this.currentStep === 2) {
      // En el paso 2, no permitir avanzar manualmente - se avanza automáticamente
      return false;
    }
    return true;
  }

  // Método para guardar la factura
  onGuardarFactura(): void {
    if (!this.validarDataComponent || !this.selectedFile) {
      return;
    }

    const facturaData = this.validarDataComponent.getFormData();

    // Crear FormData para enviar tanto los datos como el archivo
    const formData = new FormData();

    formData.append('facturaData', JSON.stringify(facturaData));

    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.isLoading = true;

    this.subirFacturaPG.crearFacturaConArchivo(formData).subscribe({
      next: (response: any) => {
        console.log('Factura y archivo guardados:');
        this.isLoading = false;

        if (response.success) {
          this.currentStep = 4;
          this.cdRef.detectChanges();
        } else {
          alert(`Error: ${response.message}`);
        }
      },
      error: (error: any) => {
        console.error('Error al guardar:', error);
        this.isLoading = false;
        alert('Error al guardar la factura. Intenta nuevamente.');
      },
    });
  }

  reiniciarProceso(): void {
    this.selectedFile = null;
    this.currentStep = 1;
    this.procesamientoResultado = null;
    this.jsonData_n8n = null;
    this.isLoading = false;
    this.subirFacturaForm.reset();
  }
}
