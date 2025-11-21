// factura-detalle.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacturaDetalle } from './entities/facturas-detalle.entity';
import { CreateFacturaDetalleDto } from './dto/create-facturas-detalle.dto';

@Injectable()
export class FacturaDetalleService {
  constructor(
    @InjectRepository(FacturaDetalle)
    private readonly facturaDetalleRepository: Repository<FacturaDetalle>,
  ) {}

  async create(
    createFacturaDetalleDto: CreateFacturaDetalleDto,
  ): Promise<FacturaDetalle> {
    const detalle = this.facturaDetalleRepository.create(
      createFacturaDetalleDto,
    );
    return await this.facturaDetalleRepository.save(detalle);
  }

  async createMultiple(
    detalles: CreateFacturaDetalleDto[],
  ): Promise<FacturaDetalle[]> {
    const detallesCreados: FacturaDetalle[] = [];

    for (const detalleDto of detalles) {
      const detalle = await this.create(detalleDto);
      detallesCreados.push(detalle);
    }

    return detallesCreados;
  }

  async findByFacturaId(idFactura: number): Promise<FacturaDetalle[]> {
    return await this.facturaDetalleRepository.find({
      where: { id_factura: idFactura },
      relations: ['producto'],
    });
  }
}
