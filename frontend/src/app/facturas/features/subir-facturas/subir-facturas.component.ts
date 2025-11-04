import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StepperComponent } from './stepper/stepper.component';

@Component({
  selector: 'app-subir-facturas.component',
  standalone: true,
  imports: [ReactiveFormsModule, StepperComponent],
  templateUrl: './subir-facturas.component.html',
  styleUrl: './subir-facturas.component.css',
})
export default class SubirFacturasComponent {}
