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
    if (!this.auth.currentUser) {
      return next.handle(req);
    }

    return from(this.auth.currentUser.getIdToken(true)).pipe(
      switchMap((token) => {
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        return next.handle(clonedReq);
      }),
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          localStorage.removeItem('firebase_token');
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
}
