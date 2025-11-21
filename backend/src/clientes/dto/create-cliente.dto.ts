// dto/create-cliente.dto.ts
import { IsString, IsInt, IsOptional, IsNotEmpty, Min } from 'class-validator';

export class CreateClienteDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsInt()
  @Min(1000000, { message: 'La cédula debe tener al menos 7 dígitos' })
  cedula?: number;

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
