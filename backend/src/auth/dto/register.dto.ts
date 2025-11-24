import { IsOptional, IsInt, IsString, IsNotEmpty, Min } from 'class-validator';

export class RegisterDto {
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

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  contraseña: string;
}
