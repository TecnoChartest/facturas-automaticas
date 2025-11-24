import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ClienteService } from 'src/clientes/clientes.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly clienteService: ClienteService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.contraseña, 10);

    const cliente = await this.clienteService.create({
      cedula: dto.cedula,
      nombre_cliente: dto.nombre_cliente,
      ciudad: dto.ciudad,
      direccion: dto.direccion,
      telefono: dto.telefono,
      contraseña: hashedPassword,
    });

    return {
      message: 'Cliente registrado correctamente',
      cliente,
    };
  }

  async login(dto: LoginDto) {
    // Buscar el cliente según el campo que uses para login (puede ser cedula o nombre)
    const cliente = dto.cedula
      ? await this.clienteService.findByCedula(dto.cedula)
      : await this.clienteService.findByNombre(dto.nombre_cliente);

    if (!cliente) {
      throw new UnauthorizedException('Cliente no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.contraseña,
      cliente.contraseña,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { sub: cliente.id, cedula: cliente.cedula };

    return {
      access_token: this.jwtService.sign(payload),
      cliente,
    };
  }
}
