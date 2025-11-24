import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/auth/auth.interceptor';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),

    // Cliente HTTP con Fetch API + Interceptor JWT
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
  ],
}).catch(err => console.error(err));
