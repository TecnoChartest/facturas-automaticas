import { Factura } from 'src/facturas/entities/factura.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ schema: 'public', name: 'factura_detalle' })
export class FacturaDetalle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  id_factura: number;

  @Column('int')
  id_producto: number;

  @Column('int')
  cantidad: number;

  @ManyToOne(() => Factura, (factura) => factura.detalles)
  @JoinColumn({ name: 'id_factura' })
  factura: Factura;

  @ManyToOne(() => Producto, (producto) => producto.facturaDetalles)
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;
}
