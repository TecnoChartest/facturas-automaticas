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
import express from 'express';
import { ConflictException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { ClienteService } from './clientes.service';
import { Cliente } from './entities/cliente.entity';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
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
