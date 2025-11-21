import { Module } from '@nestjs/common';
import { FacturaDetalle } from './entities/facturas-detalle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturaDetalleService } from './facturas-detalle.service';
import { FacturaDetalleController } from './facturas-detalle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FacturaDetalle])],
  controllers: [FacturaDetalleController],
  providers: [FacturaDetalleService],
})
export class FacturasDetalleModule {}
