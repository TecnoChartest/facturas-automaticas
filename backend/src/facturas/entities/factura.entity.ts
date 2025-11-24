import { Cliente } from 'src/clientes/entities/cliente.entity';
import { FacturaDetalle } from 'src/facturas-detalle/entities/facturas-detalle.entity';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({ schema: 'public', name: 'factura' })
export class Factura {
  @PrimaryColumn()
  id: number;

  @Column('int')
  id_cliente: number;

  @Column({
    type: 'date',
    default: () => 'CURRENT_DATE',
    nullable: false,
    name: 'fecha_generacion',
  })
  fechaGeneracion: Date;

  @Column({
    type: 'date',
    default: () => 'CURRENT_DATE',
    nullable: false,
    name: 'fecha_vencimiento',
  })
  fechaVencimiento: Date;

  @Column('decimal', { precision: 14, scale: 2 })
  totalBruto: number;

  @Column('decimal', { precision: 14, scale: 2, nullable: true })
  totalIva: number;

  @Column('decimal', { precision: 14, scale: 2 })
  totalPagar: number;

  @Column('varchar', { length: 50 })
  metodoPago: string;

  @Column('text')
  path: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.facturas)
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @OneToMany(() => FacturaDetalle, (detalle) => detalle.factura)
  detalles: FacturaDetalle[];
}
