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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { FacturasService } from './facturas.service';
import { FileService } from './file.service';

@Controller('facturas')
export class FacturasController {
  constructor(
    private readonly facturasService: FacturasService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  async create(
    @Body() createFacturaDto: CreateFacturaDto,
    @Res() res: Response,
  ) {
    try {
      const nuevaFactura = await this.facturasService.create(createFacturaDto);

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

      const nuevaFactura = await this.facturasService.create(createFacturaDto);

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
  findAll() {
    return this.facturasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facturasService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFacturaDto: UpdateFacturaDto) {
  //   return this.facturasService.update(+id, updateFacturaDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facturasService.remove(+id);
  }
}
