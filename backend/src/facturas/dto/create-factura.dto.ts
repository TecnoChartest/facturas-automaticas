/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFacturaDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  productos: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fechaGeneracion: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fechaVencimiento: Date;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  totalBruto: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  totalIva?: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  totalPagar: number;

  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  metodoPago: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  nombreCliente: string;

  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  cedula: string;

  @IsString()
  @Length(1, 250)
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  ciudad: string;
}
