import { Injectable, ConflictException } from '@nestjs/common';
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

  async findByCedula(cedula: number): Promise<Cliente | null> {
    return await this.clienteRepository.findOne({
      where: { cedula: cedula },
    });
  }

  async findById(id: number): Promise<Cliente | null> {
    return await this.clienteRepository.findOne({
      where: { id },
    });
  }
}
