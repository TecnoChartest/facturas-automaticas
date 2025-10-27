/* eslint-disable prettier/prettier */
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFacturaDto {

  @IsString()
  id: string;

  @IsInt()
  idUsuario: number;

  @IsDateString()
  fechaGeneracion: string;

  @IsDateString()
  fechaExpedicion: string;

  @IsDateString()
  fechaVencimiento: string;

  @IsNotEmpty()
  productos: any;

  @IsString()
  metodoPago: string;

  @IsInt()
  totalBruto: number;

  @IsOptional()
  @IsInt()
  totalIva?: number;

  @IsInt()
  totalPagar: number;

  @IsString()
  path: string;

}
