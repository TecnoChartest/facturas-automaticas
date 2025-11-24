import { IsInt, Min } from 'class-validator';

export class CreateFacturaDetalleDto {
  @IsInt()
  id: number;

  @IsInt()
  @Min(1, { message: 'El ID de la factura es obligatorio' })
  id_factura: number;

  @IsInt()
  @Min(1, { message: 'El ID del producto es obligatorio' })
  id_producto: number;

  @IsInt()
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  cantidad: number;
}
