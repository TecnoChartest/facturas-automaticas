import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { ClientesModule } from 'src/clientes/clientes.module';

@Module({
  imports: [
    ClientesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key', // en producción usar variable de entorno fuerte
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
