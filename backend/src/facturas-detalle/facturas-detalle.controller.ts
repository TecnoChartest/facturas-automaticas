/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Param,
  HttpStatus,
} from '@nestjs/common';
import * as express from 'express';
import { CreateFacturaDetalleDto } from './dto/create-facturas-detalle.dto';
import { FacturaDetalleService } from './facturas-detalle.service';

@Controller('factura-detalle')
export class FacturaDetalleController {
  constructor(private readonly facturaDetalleService: FacturaDetalleService) {}

  @Post()
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
