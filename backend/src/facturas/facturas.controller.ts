/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { FacturasService } from './facturas.service';
import { FileService } from './file.service';
import { Factura } from './entities/factura.entity';
import { Public } from '../auth/public.decorator';

@ApiTags('Facturas')
@ApiBearerAuth('firebase-auth')
@Controller('facturas')
export class FacturasController {
  constructor(
    private readonly facturaService: FacturasService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva factura',
    description: 'Crea una factura sin archivo adjunto',
  })
  @ApiResponse({
    status: 201,
    description: 'Factura creada exitosamente',
    type: Factura,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido' })
  @ApiResponse({ status: 409, description: 'Factura duplicada' })
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
  @ApiOperation({
    summary: 'Crear factura con archivo',
    description: 'Crea una factura y sube el archivo PDF o imagen',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'facturaData'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo PDF o imagen de la factura',
        },
        facturaData: {
          type: 'string',
          description: 'Datos de la factura en formato JSON stringificado',
          example: JSON.stringify({
            id: 1001,
            id_cliente: 1,
            fechaGeneracion: '2025-01-20',
            fechaVencimiento: '2025-02-20',
            totalBruto: 1000,
            totalIva: 190,
            totalPagar: 1190,
            metodoPago: 'Efectivo',
          }),
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Factura y archivo guardados' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
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
  @ApiOperation({ summary: 'Listar todas las facturas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de facturas con clientes y detalles',
    type: [Factura],
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
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
  @ApiOperation({ summary: 'Obtener una factura por ID' })
  @ApiParam({ name: 'id', description: 'ID de la factura', example: 1001 })
  @ApiResponse({
    status: 200,
    description: 'Factura encontrada',
    type: Factura,
  })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: string) {
    return this.facturaService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una factura' })
  @ApiParam({ name: 'id', description: 'ID de la factura a eliminar' })
  @ApiResponse({ status: 200, description: 'Factura eliminada' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('id') id: string) {
    return this.facturaService.remove(+id);
  }

  // Ejemplo de endpoint público (sin autenticación)
  @Public()
  @Get('health/check')
  @ApiOperation({ summary: 'Health check (público)' })
  @ApiResponse({ status: 200, description: 'Servicio funcionando' })
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
