import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'factura', schema: 'public' })
export class Factura {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  productos: string;

  @Column({ type: 'date', name: 'fecha_generacion' })
  fechaGeneracion: Date;

  @Column({ type: 'date', name: 'fecha_vencimiento' })
  fechaVencimiento: Date;

  @Column({ type: 'int', name: 'total_bruto' })
  totalBruto: number;

  @Column({ type: 'int', name: 'total_iva', nullable: true })
  totalIva: number;

  @Column({ type: 'int', name: 'total_pagar' })
  totalPagar: number;

  @Column({ type: 'varchar', length: 50, name: 'metodo_pago' })
  metodoPago: string;

  @Column({ type: 'text' })
  path: string;

  @Column({ type: 'varchar', length: 50, name: 'nombre_cliente' })
  nombreCliente: string;

  @Column({ type: 'varchar', length: 50 })
  cedula: string;

  @Column({ type: 'varchar', length: 250 })
  direccion: string;

  @Column({ type: 'varchar', length: 50 })
  telefono: string;

  @Column({ type: 'varchar', length: 50 })
  ciudad: string;
}
