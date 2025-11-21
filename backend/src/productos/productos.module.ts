import { Module } from '@nestjs/common';
import { Producto } from './entities/producto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoService } from './productos.service';
import { ProductoController } from './productos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])],
  controllers: [ProductoController],
  providers: [ProductoService],
})
export class ProductosModule {}
