import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth: Auth = inject(Auth);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.auth.currentUser) {
      return next.handle(req);
    }

    return from(this.auth.currentUser.getIdToken()).pipe(
      switchMap((token) => {
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next.handle(clonedReq);
      })
    );
  }
}
