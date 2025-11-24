import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StepperComponent } from './stepper/stepper.component';

@Component({
  selector: 'app-subir-facturas',
  standalone: true,
  imports: [ReactiveFormsModule, StepperComponent],
  templateUrl: './subir-facturas.component.html',
  styleUrls: ['./subir-facturas.component.css'],
})
export class SubirFacturasComponent {}
