/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Usuario } from './usuarios/entities/usuario.entity';
import { UsuariosController } from './usuarios/usuarios.controller';
import { UsuariosService } from './usuarios/usuarios.service';
import { FacturasModule } from './facturas/facturas.module';
import { Factura } from './facturas/entities/factura.entity';
import { FacturasController } from './facturas/facturas.controller';
import { FacturasService } from './facturas/facturas.service';
import { ReportesModule } from './reportes/reportes.module';
import { Reporte } from './reportes/entities/reporte.entity';
import { ReportesController } from './reportes/reportes.controller';
import { ReportesService } from './reportes/reportes.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //inyeccion de dependencias
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'chartest',
        password: 'chartest',
        database: 'facturas_automaticas_DB',
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Usuario, Factura, Reporte]),
  ],
  controllers: [UsuariosController, FacturasController, ReportesController],
  providers: [UsuariosService, FacturasService, ReportesService],
})
export class AppModule { }
