import { Factura } from 'src/facturas/entities/factura.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ schema: 'public', name: 'cliente' })
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  cedula: string;

  @Column('varchar', { length: 100 })
  nombre_cliente: string;

  @Column('text', { nullable: true })
  direccion: string;

  @Column('varchar', { length: 50, nullable: true })
  telefono: string;

  @Column('varchar', { length: 50 })
  ciudad: string;

  @OneToMany(() => Factura, (factura) => factura.cliente)
  facturas: Factura[];
}
