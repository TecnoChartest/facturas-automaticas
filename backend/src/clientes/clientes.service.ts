/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { Factura } from 'src/facturas/entities/factura.entity';
import { FacturaDetalle } from 'src/facturas-detalle/entities/facturas-detalle.entity';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
    @InjectRepository(FacturaDetalle)
    private readonly facturaDetalleRepository: Repository<FacturaDetalle>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    if (createClienteDto.cedula) {
      const existeCliente = await this.clienteRepository.findOne({
        where: { cedula: createClienteDto.cedula },
      });

      if (existeCliente) {
        throw new ConflictException('Ya existe un cliente con esta cédula');
      }
    }

    const cliente = this.clienteRepository.create(createClienteDto);
    return await this.clienteRepository.save(cliente);
  }

  async findByCedula(cedula: string): Promise<Cliente | null> {
    return await this.clienteRepository.findOne({
      where: { cedula: cedula },
    });
  }

  async findById(id: number): Promise<Cliente | null> {
    return await this.clienteRepository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<Cliente[]> {
    try {
      const clientes = await this.clienteRepository.find({
        order: {
          id: 'ASC',
        },
      });

      if (!clientes || clientes.length === 0) {
        throw new HttpException(
          'No se encontraron clientes',
          HttpStatus.NOT_FOUND,
        );
      }

      return clientes;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor al obtener clientes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async update(
    id: number,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
    });

    if (!cliente) {
      throw new HttpException(
        `Cliente con ID ${id} no encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (updateClienteDto.cedula && updateClienteDto.cedula !== cliente.cedula) {
      const existeCedula = await this.clienteRepository.findOne({
        where: { cedula: updateClienteDto.cedula },
      });

      if (existeCedula) {
        throw new ConflictException('Ya existe un cliente con esta cédula');
      }
    }

    // Actualizar los campos
    Object.assign(cliente, updateClienteDto);
    return await this.clienteRepository.save(cliente);
  }

  async remove(id: number): Promise<void> {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: ['facturas', 'facturas.detalles'],
    });

    if (!cliente) {
      throw new HttpException(
        `Cliente con ID ${id} no encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    const queryRunner =
      this.clienteRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const factura of cliente.facturas) {
        if (factura.detalles && factura.detalles.length > 0) {
          await queryRunner.manager.remove(FacturaDetalle, factura.detalles);
        }
      }

      if (cliente.facturas.length > 0) {
        await queryRunner.manager.remove(Factura, cliente.facturas);
      }

      await queryRunner.manager.remove(Cliente, cliente);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Error al eliminar el cliente y sus datos asociados',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
