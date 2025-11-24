import { PartialType } from '@nestjs/mapped-types';
import { CreateFacturaDetalleDto } from './create-facturas-detalle.dto';

export class UpdateFacturasDetalleDto extends PartialType(CreateFacturaDetalleDto) {}
