/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { CreateProductoDto } from './dto/create-producto.dto';
import * as express from 'express';
import { ProductoService } from './productos.service';

@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
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
