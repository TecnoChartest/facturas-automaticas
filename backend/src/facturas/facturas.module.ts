import { Module } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { FileService } from './file.service';
import { Factura } from './entities/factura.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturaDetalle } from 'src/facturas-detalle/entities/facturas-detalle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, FacturaDetalle])],
  controllers: [FacturasController],
  providers: [FacturasService, FileService],
})
export class FacturasModule {}
