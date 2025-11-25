// update-factura.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateFacturaDto } from './create-factura.dto';
import {
  IsOptional,
  IsDate,
  IsNumber,
  IsString,
  Min,
  IsInt,
} from 'class-validator';

export class UpdateFacturaDto extends PartialType(CreateFacturaDto) {
  @IsOptional()
  @IsInt()
  id_cliente?: number;

  @IsOptional()
  @IsDate()
  fechaGeneracion?: Date;

  @IsOptional()
  @IsDate()
  fechaVencimiento?: Date;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El total bruto debe ser mayor o igual a 0' })
  totalBruto?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El total IVA debe ser mayor o igual a 0' })
  totalIva?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El total a pagar debe ser mayor o igual a 0' })
  totalPagar?: number;

  @IsOptional()
  @IsString()
  metodoPago?: string;
}
