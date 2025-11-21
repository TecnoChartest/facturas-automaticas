// dto/create-factura.dto.ts
import {
  IsString,
  IsInt,
  IsDate,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CreateFacturaDto {
  @IsInt()
  id: number;

  @IsInt()
  @Min(1, { message: 'El ID del cliente es obligatorio' })
  id_cliente: number;

  @IsDate()
  fechaGeneracion: Date;

  @IsDate()
  fechaVencimiento: Date;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El total bruto debe ser mayor o igual a 0' })
  totalBruto: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El total IVA debe ser mayor o igual a 0' })
  totalIva?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El total a pagar debe ser mayor o igual a 0' })
  totalPagar: number;

  @IsString()
  @IsOptional()
  metodoPago: string;

  @IsString()
  @IsNotEmpty({ message: 'El path es obligatorio' })
  path: string;
}
