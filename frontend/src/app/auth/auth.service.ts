import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);

  async register(email: string, pass: string) {
    const credential = await createUserWithEmailAndPassword(this.auth, email, pass);
    await sendEmailVerification(credential.user);
    return credential;
  }

  async login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  async getToken() {
    return this.auth.currentUser?.getIdToken();
  }

  logout() {
    return signOut(this.auth);
  }
}
