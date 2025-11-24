// dto/create-cliente.dto.ts
import { IsString, IsInt, IsOptional, IsNotEmpty, Min } from 'class-validator';

export class CreateClienteDto {
  // No necesitas el id como entrada en el DTO si es generado automáticamente.
  // @IsInt()
  // id: number;

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

  // Agrega contraseña para registro
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  contraseña: string;
}
