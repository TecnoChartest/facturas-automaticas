import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  @MaxLength(50)
  nombreUsuario: string;

  @IsString()
  contraseña: string;

  @IsOptional()
  @IsInt()
  cedula?: number;

  @IsString()
  @MaxLength(50)
  nombre: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  ciudad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  direccion?: string;
}
