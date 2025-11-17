import { ConflictException, Injectable } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { Factura } from './entities/factura.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura)
    private facturaRepository: Repository<Factura>,
  ) {}

  async create(createFacturaDto: CreateFacturaDto): Promise<Factura> {
    // Verificar si ya existe una factura con el mismo ID
    const existeFactura = await this.facturaRepository.findOne({
      where: { id: createFacturaDto.id },
    });

    if (existeFactura) {
      throw new ConflictException('Ya existe una factura con este ID');
    }

    // Crear y guardar la nueva factura
    const factura = this.facturaRepository.create(createFacturaDto);
    return await this.facturaRepository.save(factura);
  }

  findAll() {
    return `This action returns all facturas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} factura`;
  }

  // update(id: number, updateFacturaDto: UpdateFacturaDto) {
  //   return `This action updates a #${id} factura`;
  // }

  remove(id: number) {
    return `This action removes a #${id} factura`;
  }
}
