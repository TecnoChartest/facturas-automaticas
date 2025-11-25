import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [FirebaseService, AuthGuard],
  exports: [FirebaseService, AuthGuard],
})
export class AuthModule {}
