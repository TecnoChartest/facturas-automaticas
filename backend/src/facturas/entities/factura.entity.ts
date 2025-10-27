/* eslint-disable prettier/prettier */
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('factura')
export class Factura {

  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ name: 'id_usuario' })
  idUsuario: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.facturas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ name: 'fecha_generacion', type: 'date' })
  fechaGeneracion: Date;

  @Column({ name: 'fecha_expedicion', type: 'date' })
  fechaExpedicion: Date;

  @Column({ name: 'fecha_vencimiento', type: 'date' })
  fechaVencimiento: Date;

  @Column({ type: 'json' })
  productos: any;

  @Column({ name: 'metodo_pago', length: 50 })
  metodoPago: string;

  @Column({ name: 'total_bruto', type: 'int' })
  totalBruto: number;

  @Column({ name: 'total_iva', type: 'int', nullable: true })
  totalIva?: number;

  @Column({ name: 'total_pagar', type: 'int' })
  totalPagar: number;

  @Column({ type: 'text' })
  path: string;

}
