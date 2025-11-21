import { FacturaDetalle } from 'src/facturas-detalle/entities/facturas-detalle.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ schema: 'public', name: 'producto' })
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50, unique: true })
  nombre: string;

  @OneToMany(() => FacturaDetalle, (detalle) => detalle.producto)
  facturaDetalles: FacturaDetalle[];
}
