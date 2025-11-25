/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// factura-detalle.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Param,
  HttpStatus,
} from '@nestjs/common';
import express from 'express';
import { CreateFacturaDetalleDto } from './dto/create-facturas-detalle.dto';
import { FacturaDetalleService } from './facturas-detalle.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FacturaDetalle } from './entities/facturas-detalle.entity';
@ApiTags('FacturaDetalle')
@ApiBearerAuth('firebase-auth')
@Controller('factura-detalle')
export class FacturaDetalleController {
  constructor(private readonly facturaDetalleService: FacturaDetalleService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un detalle de factura',
    description: 'Crea un nuevo detalle asociado a una factura',
  })
  @ApiResponse({
    status: 201,
    description: 'Detalle de factura creado exitosamente',
    type: FacturaDetalle,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(
    @Body() createFacturaDetalleDto: CreateFacturaDetalleDto,
    @Res() res: express.Response,
  ) {
    try {
      const nuevoDetalle = await this.facturaDetalleService.create(
        createFacturaDetalleDto,
      );

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Detalle de factura creado exitosamente',
        data: nuevoDetalle,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al crear el detalle de factura',
        error: error.message,
      });
    }
  }

  @Post('multiple')
  @ApiOperation({
    summary: 'Crear múltiples detalles de factura',
    description: 'Crea varios detalles de factura en una sola petición',
  })
  @ApiBody({
    description: 'Array de detalles de factura a crear',
    schema: {
      type: 'array',
      items: { $ref: '#/components/schemas/CreateFacturaDetalleDto' },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Detalles de factura creados exitosamente',
    type: [FacturaDetalle],
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async createMultiple(
    @Body() detalles: CreateFacturaDetalleDto[],
    @Res() res: express.Response,
  ) {
    try {
      const detallesCreados =
        await this.facturaDetalleService.createMultiple(detalles);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Detalles de factura creados exitosamente',
        data: detallesCreados,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al crear los detalles de factura',
        error: error.message,
      });
    }
  }

  @Get('factura/:idFactura')
  @ApiOperation({
    summary: 'Obtener detalles por ID de factura',
    description: 'Devuelve todos los detalles asociados a una factura',
  })
  @ApiParam({
    name: 'idFactura',
    description: 'ID de la factura',
    example: 1001,
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de factura obtenidos correctamente',
    type: [FacturaDetalle],
  })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findByFacturaId(
    @Param('idFactura') idFactura: string,
    @Res() res: express.Response,
  ) {
    try {
      const id = Number(idFactura);
      const detalles = await this.facturaDetalleService.findByFacturaId(id);

      return res.status(HttpStatus.OK).json({
        success: true,
        data: detalles,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al obtener los detalles de la factura',
        error: error.message,
      });
    }
  }
}
