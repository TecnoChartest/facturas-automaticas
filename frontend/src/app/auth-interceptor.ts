import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si no hay usuario, continuar sin token
    if (!this.auth.currentUser) {
      return next.handle(req);
    }

    // Obtener token fresco y agregarlo
    return from(this.auth.currentUser.getIdToken(true)).pipe(
      switchMap((token) => {
        // Clonar request con token
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('🔐 Request con autenticación:', req.url);
        return next.handle(clonedReq);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error en request:', error);

        // Si es 401, redirigir a login
        if (error.status === 401) {
          console.log('🚪 Token inválido, redirigiendo a login...');
          localStorage.removeItem('firebase_token');
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
}
