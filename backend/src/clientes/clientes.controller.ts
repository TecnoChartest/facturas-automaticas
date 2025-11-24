import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ClienteService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  async create(@Body() createClienteDto: CreateClienteDto) {
    const nuevo = await this.clienteService.create(createClienteDto);
    return {
      success: true,
      message: 'Cliente creado exitosamente',
      data: nuevo,
    };
  }

  // 🔹 Buscar por cédula
  @Get('cedula/:cedula')
  async findByCedula(@Param('cedula') cedula: string) {
    const numCedula = Number(cedula);
    if (isNaN(numCedula)) {
      throw new ConflictException('Cédula inválida');
    }

    const cliente = await this.clienteService.findByCedula(numCedula);
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return {
      success: true,
      data: cliente,
    };
  }

  // 🔹 Nuevo endpoint: traer todos los clientes
  @Get()
  async findAll() {
    const clientes = await this.clienteService.findAll();
    return {
      success: true,
      data: clientes,
    };
  }

  // 🔹 Buscar por nombre (opcional)
  @Get('nombre/:nombre')
  async findByNombre(@Param('nombre') nombre: string) {
    const cliente = await this.clienteService.findByNombre(nombre);
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return {
      success: true,
      data: cliente,
    };
  }
}
