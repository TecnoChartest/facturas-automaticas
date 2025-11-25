// dto/create-cliente.dto.ts
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateClienteDto {
  @IsOptional()
  @IsString()
  cedula: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del cliente es obligatorio' })
  nombre_cliente: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsString()
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  ciudad: string;
}
