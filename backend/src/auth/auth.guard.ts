/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No se encontró token de autorización.');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verificamos el token con Firebase
      const decodedToken = await this.firebaseService
        .getAuth()
        .verifyIdToken(token);
      // Guardamos los datos del usuario en la request por si los necesitas luego
      request['user'] = decodedToken;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Sesión inválida o expirada.');
    }
  }
}
