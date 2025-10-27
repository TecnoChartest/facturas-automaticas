import { Factura } from 'src/facturas/entities/factura.entity';
import { Reporte } from 'src/reportes/entities/reporte.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('usuario')
export class Usuario {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ name: 'nombre_usuario', length: 50 })
  nombreUsuario: string;

  @Column({ type: 'text' })
  contraseña: string;

  @Column({ type: 'int', nullable: true })
  cedula?: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  email?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ciudad?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  direccion?: string;

  @OneToMany(() => Factura, (factura) => factura.usuario)
  facturas: Factura[];

  @OneToMany(() => Reporte, (reporte) => reporte.usuario)
  reportes: Reporte[];
}
