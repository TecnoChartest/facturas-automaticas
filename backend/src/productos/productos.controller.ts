/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// producto.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Query,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import express from 'express';
import { CreateProductoDto } from './dto/create-producto.dto';
import { ProductoService } from './productos.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Producto } from './entities/producto.entity';

@ApiTags('Productos')
@ApiBearerAuth('firebase-auth')
@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({
    status: 201,
    description: 'Producto creado exitosamente',
    type: Producto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 409, description: 'Producto duplicado' })
  async create(
    @Body() createProductoDto: CreateProductoDto,
    @Res() res: express.Response,
  ) {
    try {
      const nuevoProducto =
        await this.productoService.create(createProductoDto);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: nuevoProducto,
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
        message: 'Error al crear el producto',
        error: error.message,
      });
    }
  }

  @Get('buscar')
  @ApiOperation({
    summary: 'Buscar producto por nombre',
    description: 'Busca un producto por su nombre (parámetro query "nombre")',
  })
  @ApiQuery({
    name: 'nombre',
    description: 'Nombre del producto a buscar',
    required: true,
    example: 'Café',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado de la búsqueda (puede ser null si no existe)',
    type: Producto,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findByNombre(
    @Query('nombre') nombre: string,
    @Res() res: express.Response,
  ) {
    try {
      const nombreDecodificado = decodeURIComponent(nombre);
      const producto =
        await this.productoService.findByNombre(nombreDecodificado);

      if (producto) {
        return res.status(HttpStatus.OK).json({
          success: true,
          data: producto,
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: false,
          message: 'Producto no encontrado',
          data: null,
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al buscar el producto',
        error: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos',
    type: [Producto],
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findAll(@Res() res: express.Response) {
    try {
      const productos = await this.productoService.findAll();

      return res.status(HttpStatus.OK).json({
        success: true,
        data: productos,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al obtener los productos',
        error: error.message,
      });
    }
  }
}
