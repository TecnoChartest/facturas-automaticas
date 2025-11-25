import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: [],
})
export class AuthComponent {
  authService = inject(AuthService);

  email = '';
  password = '';
  isLogin = true;
  message = '';

  async onSubmit() {
    this.message = '';
    try {
      if (this.isLogin) {
        const userCred = await this.authService.login(this.email, this.password);
        if (!userCred.user.emailVerified) {
          this.message = 'Por favor verifica tu correo electrónico antes de entrar.';
        } else {
          // const token = await this.authService.getToken();

        }
      } else {
        await this.authService.register(this.email, this.password);
        this.message = 'Registro exitoso. Hemos enviado un correo de verificación.';
        this.isLogin = true;
      }
    } catch (error: any) {
      this.handleError(error);
    }
  }

  handleError(error: any) {
    if (error.code === 'auth/email-already-in-use') {
      this.message = 'El correo ya está registrado.';
    } else if (error.code === 'auth/wrong-password') {
      this.message = 'Contraseña incorrecta.';
    } else {
      this.message = 'Ocurrió un error: ' + error.message;
    }
  }
}
