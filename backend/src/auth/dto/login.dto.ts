import { IsOptional, IsInt, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsInt()
  cedula?: number;

  @IsOptional()
  @IsString()
  nombre_cliente: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  contraseña: string;
}
