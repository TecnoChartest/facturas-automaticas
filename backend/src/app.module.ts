/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturasModule } from './facturas/facturas.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProductosModule } from './productos/productos.module';
import { FacturasDetalleModule } from './facturas-detalle/facturas-detalle.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    FacturasModule,
    ClientesModule,
    ProductosModule,
    FacturasDetalleModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
