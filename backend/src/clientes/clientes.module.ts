import { Module } from '@nestjs/common';
import { ClienteService } from './clientes.service';
import { ClienteController } from './clientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { FacturaDetalle } from 'src/facturas-detalle/entities/facturas-detalle.entity';
import { Factura } from 'src/facturas/entities/factura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Factura, FacturaDetalle])],
  controllers: [ClienteController],
  providers: [ClienteService],
})
export class ClientesModule {}
