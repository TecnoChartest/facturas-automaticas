import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
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
      throw new ConflictException({
        success: false,
        message: '¡Ya existe una factura con este número!',
        alert: true,
        data: existeFactura,
      });
    }

    // Crear y guardar la nueva factura
    const factura = this.facturaRepository.create(createFacturaDto);
    return await this.facturaRepository.save(factura);
  }

  async findAll(): Promise<Factura[]> {
    try {
      const facturas = await this.facturaRepository.find({
        relations: [
          'cliente', // Incluir datos del cliente
          'detalles', // Incluir detalles de la factura
        ],
        order: {
          id: 'ASC',
        },
      });

      if (!facturas || facturas.length === 0) {
        throw new HttpException(
          'No se encontraron facturas',
          HttpStatus.NOT_FOUND,
        );
      }

      return facturas;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor al obtener facturas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Método adicional para buscar por ID (opcional)
  async findOne(id: number): Promise<Factura> {
    try {
      const factura = await this.facturaRepository.findOne({
        where: { id },
        relations: ['cliente', 'detalles'],
      });

      if (!factura) {
        throw new HttpException(
          `Factura con ID ${id} no encontrada`,
          HttpStatus.NOT_FOUND,
        );
      }

      return factura;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor al obtener la factura',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} factura`;
  }
}
