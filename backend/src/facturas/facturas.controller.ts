/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  Get,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { FacturasService } from './facturas.service';
import { FileService } from './file.service';
import { Factura } from './entities/factura.entity';

@Controller('facturas')
export class FacturasController {
  constructor(
    private readonly facturaService: FacturasService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  async create(
    @Body() createFacturaDto: CreateFacturaDto,
    @Res() res: Response,
  ) {
    try {
      const nuevaFactura = await this.facturaService.create(createFacturaDto);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Factura creada exitosamente',
        data: nuevaFactura,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al crear la factura',
        error: error.message,
      });
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async createWithFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('facturaData') facturaDataString: string,
    @Res() res: Response,
  ) {
    try {
      const createFacturaDto: CreateFacturaDto = JSON.parse(facturaDataString);

      const filePath = this.fileService.saveFile(file);

      createFacturaDto.path = filePath;

      const nuevaFactura = await this.facturaService.create(createFacturaDto);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Factura y archivo guardados exitosamente',
        data: nuevaFactura,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al guardar factura',
        error: error.message,
      });
    }
  }

  @Get()
  async findAll(): Promise<Factura[]> {
    try {
      const facturas = await this.facturaService.findAll();
      return facturas;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener las facturas',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facturaService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facturaService.remove(+id);
  }
}
