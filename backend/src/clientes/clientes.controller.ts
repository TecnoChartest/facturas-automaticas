/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import express from 'express';
import { ConflictException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { ClienteService } from './clientes.service';
import { Cliente } from './entities/cliente.entity';

@ApiTags('Clientes')
@ApiBearerAuth('firebase-auth')
@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo cliente',
    description:
      'Crea un cliente nuevo en el sistema. La cédula debe ser única.',
  })
  @ApiBody({
    type: CreateClienteDto,
    examples: {
      ejemplo1: {
        summary: 'Cliente con todos los datos',
        value: {
          cedula: '1234567890',
          nombre_cliente: 'Juan Pérez',
          direccion: 'Calle Principal #123',
          telefono: '3001234567',
          ciudad: 'Pasto',
        },
      },
      ejemplo2: {
        summary: 'Cliente mínimo requerido',
        value: {
          nombre_cliente: 'María García',
          ciudad: 'Bogotá',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Cliente creado exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Cliente creado exitosamente',
        data: {
          id: 1,
          cedula: '1234567890',
          nombre_cliente: 'Juan Pérez',
          direccion: 'Calle Principal #123',
          telefono: '3001234567',
          ciudad: 'Pasto',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un cliente con esta cédula',
    schema: {
      example: {
        success: false,
        message: 'Ya existe un cliente con esta cédula',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'El nombre del cliente es obligatorio',
          'La ciudad es obligatoria',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o expirado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    schema: {
      example: {
        success: false,
        message: 'Error al crear el cliente',
        error: 'Database connection failed',
      },
    },
  })
  async create(
    @Body() createClienteDto: CreateClienteDto,
    @Res() res: express.Response,
  ) {
    try {
      const nuevoCliente = await this.clienteService.create(createClienteDto);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Cliente creado exitosamente',
        data: nuevoCliente,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al crear el cliente',
        error: error.message,
      });
    }
  }

  @Get('cedula/:cedula')
  @ApiOperation({
    summary: 'Buscar cliente por cédula',
    description:
      'Busca y retorna un cliente específico utilizando su número de cédula',
  })
  @ApiParam({
    name: 'cedula',
    description: 'Número de cédula del cliente',
    example: '1234567890',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          cedula: '1234567890',
          nombre_cliente: 'Juan Pérez',
          direccion: 'Calle Principal #123',
          telefono: '3001234567',
          ciudad: 'Pasto',
          facturas: [],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
    schema: {
      example: {
        success: false,
        message: 'Cliente no encontrado',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({
    status: 500,
    description: 'Error al buscar el cliente',
    schema: {
      example: {
        success: false,
        message: 'Error al buscar el cliente',
        error: 'Database error',
      },
    },
  })
  async findByCedula(
    @Param('cedula') cedula: string,
    @Res() res: express.Response,
  ) {
    try {
      const cliente = await this.clienteService.findByCedula(cedula);

      if (cliente) {
        return res.status(HttpStatus.OK).json({
          success: true,
          data: cliente,
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Cliente no encontrado',
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al buscar el cliente',
        error: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos los clientes',
    description:
      'Obtiene una lista completa de todos los clientes registrados en el sistema, ordenados por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes obtenida exitosamente',
    type: [Cliente],
    schema: {
      example: [
        {
          id: 1,
          cedula: '1234567890',
          nombre_cliente: 'Juan Pérez',
          direccion: 'Calle Principal #123',
          telefono: '3001234567',
          ciudad: 'Pasto',
          facturas: [],
        },
        {
          id: 2,
          cedula: '0987654321',
          nombre_cliente: 'María García',
          direccion: 'Avenida 5 #45-67',
          telefono: '3109876543',
          ciudad: 'Bogotá',
          facturas: [],
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron clientes',
    schema: {
      example: {
        statusCode: 404,
        message: 'No se encontraron clientes',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    schema: {
      example: {
        status: 500,
        error: 'Error al obtener los clientes',
        message: 'Database connection failed',
      },
    },
  })
  async findAll(): Promise<Cliente[]> {
    try {
      const clientes = await this.clienteService.findAll();
      return clientes;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener los clientes',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
