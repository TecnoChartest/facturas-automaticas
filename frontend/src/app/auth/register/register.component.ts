import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error: string | null = null;
  fieldErrors: Record<string, string> = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Reproducimos las reglas del DTO:
    // cedula?: number (min 1.000.000)
    // nombre_cliente: required string
    // ciudad: required string
    // direccion?: string
    // telefono?: string
    // contraseña: required string
    this.form = this.fb.group({
      cedula: [
        null,
        [
          // optional but if provided must be at least 7 digits -> min value 1_000_000
          Validators.min(1000000),
        ],
      ],
      nombre_cliente: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      direccion: [''],
      telefono: [''],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.markAllTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    this.fieldErrors = {};

    // Construimos el payload con tipos correctos:
    const raw = this.form.value;

    // cedula en DTO es number | undefined - convertimos si existe y no es vacío
    const payload: any = {
      nombre_cliente: raw.nombre_cliente,
      ciudad: raw.ciudad,
      contraseña: raw.contraseña,
    };

    if (raw.cedula !== null && raw.cedula !== '' && raw.cedula !== undefined) {
      // Si el input devuelve string, lo convertimos a number
      const ced = typeof raw.cedula === 'string' ? Number(raw.cedula) : raw.cedula;
      if (!Number.isNaN(ced)) payload.cedula = ced;
    }

    if (raw.direccion) payload.direccion = raw.direccion;
    if (raw.telefono) payload.telefono = raw.telefono;

    this.authService.register(payload).subscribe({
      next: () => {
        this.loading = false;
        // redirigir al login después del registro
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        // Backend con class-validator suele devolver errores en err.error o err.error.message
        // Detectamos y mostramos errores de campo si vienen en formato { property: ..., constraints: {...} } o en message.
        const body = err?.error;
        if (!body) {
          this.error = 'Error en el servidor';
          return;
        }

        // Manejo común: si backend devuelve validation errors (array o object)
        if (Array.isArray(body)) {
          // formato: [{ property: 'nombre_cliente', constraints: { isNotEmpty: '...' } }, ...]
          body.forEach((violation: any) => {
            const prop = violation.property;
            const constraints = violation.constraints;
            if (prop && constraints) {
              // tomamos la primera constraint
              const firstMsg = Object.values(constraints)[0] as string;
              this.fieldErrors[prop] = firstMsg;
            }
          });
        } else if (body.message && typeof body.message === 'string') {
          // mensaje general
          this.error = body.message;
        } else if (body.message && Array.isArray(body.message)) {
          // message puede ser array de strings/objects
          // si vienen como strings, unimos
          const messages = body.message.map((m: any) =>
            typeof m === 'string' ? m : JSON.stringify(m)
          );
          this.error = messages.join(' — ');
        } else {
          // fallback
          this.error = body?.error || JSON.stringify(body);
        }
      },
    });
  }

  // marcar controles para que muestren validaciones
  private markAllTouched() {
    Object.values(this.form.controls).forEach((c) => c.markAsTouched());
  }

  // helpers para la template
  hasError(ctrl: string, errName?: string) {
    const control = this.form.get(ctrl);
    if (!control) return false;
    if (errName) return control.touched && control.hasError(errName);
    return control.touched && control.invalid;
  }

  goToLogin() {
  this.router.navigate(['/auth/login']);
  }

}
