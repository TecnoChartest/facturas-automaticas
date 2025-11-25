/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Put,
  Delete,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { FileService } from './file.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { Factura } from './entities/factura.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import express from 'express';
import { Public } from 'src/auth/public.decorator';

@Controller('facturas')
export class FacturasController {
  constructor(
    private readonly facturaService: FacturasService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  async create(
    @Body() createFacturaDto: CreateFacturaDto,
    @Res() res: express.Response,
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
    @Res() res: express.Response,
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
  async findOne(@Param('id') id: string) {
    return this.facturaService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFacturaDto: UpdateFacturaDto,
    @Res() res: express.Response,
  ) {
    try {
      const facturaActualizada = await this.facturaService.update(
        +id,
        updateFacturaDto,
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Factura actualizada exitosamente',
        data: facturaActualizada,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al actualizar la factura',
        error: error.message,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: express.Response) {
    try {
      await this.facturaService.remove(+id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Factura eliminada exitosamente',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al eliminar la factura',
        error: error.message,
      });
    }
  }

  @Public()
  @Get('health/check')
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
