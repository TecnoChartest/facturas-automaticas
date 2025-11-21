// producto.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    // Normalizar el nombre (trim y posiblemente mayúsculas)
    const nombreNormalizado = createProductoDto.nombre.trim();

    // Verificar si ya existe un producto con el mismo nombre (case insensitive)
    const existeProducto = await this.productoRepository.findOne({
      where: { nombre: ILike(nombreNormalizado) },
    });

    if (existeProducto) {
      throw new ConflictException('Ya existe un producto con este nombre');
    }

    const producto = this.productoRepository.create({
      ...createProductoDto,
      nombre: nombreNormalizado,
    });
    return await this.productoRepository.save(producto);
  }

  async findByNombre(nombre: string): Promise<Producto | null> {
    const nombreNormalizado = nombre.trim();
    return await this.productoRepository.findOne({
      where: { nombre: ILike(nombreNormalizado) },
    });
  }

  async findOrCreateByNombre(nombre: string): Promise<Producto> {
    const nombreNormalizado = nombre.trim();
    let producto = await this.findByNombre(nombreNormalizado);

    if (!producto) {
      const createProductoDto: CreateProductoDto = {
        nombre: nombreNormalizado,
      };
      producto = await this.create(createProductoDto);
    }

    return producto;
  }

  async findById(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find();
  }
}
