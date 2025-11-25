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

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
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
}
