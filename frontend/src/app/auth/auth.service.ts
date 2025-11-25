import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
      if (user) {
        this.refreshToken();
      }
    });
  }

  async register(email: string, pass: string) {
    const credential = await createUserWithEmailAndPassword(this.auth, email, pass);
    await sendEmailVerification(credential.user);
    return credential;
  }

  async login(email: string, pass: string) {
    const credential = await signInWithEmailAndPassword(this.auth, email, pass);

    if (!credential.user.emailVerified) {
      throw new Error('Por favor verifica tu correo electrónico antes de continuar.');
    }

    // Guardar token
    await this.refreshToken();

    return credential;
  }

  async refreshToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken(true);
        localStorage.setItem('firebase_token', token);
        return token;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  async getToken(): Promise<string | null> {
    let token = localStorage.getItem('firebase_token');

    if (!token && this.auth.currentUser) {
      token = await this.refreshToken();
    }

    return token;
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  isAuthenticated(): boolean {
    return this.auth.currentUser !== null && this.auth.currentUser.emailVerified === true;
  }

  async logout() {
    try {
      localStorage.removeItem('firebase_token');
      await signOut(this.auth);
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    } catch (error) {
    }
  }
}
