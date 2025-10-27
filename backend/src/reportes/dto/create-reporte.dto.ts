/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateReporteDto {

  @IsInt()
  idUser: number;

  @IsNotEmpty()
  idsFacturas: any;

  @IsString()
  path: string;

}
