import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('reporte')
export class Reporte {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ name: 'id_user' })
  idUser: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.reportes)
  @JoinColumn({ name: 'id_user' })
  usuario: Usuario;

  @Column({ name: 'ids_facturas', type: 'json' })
  idsFacturas: any;

  @Column({ type: 'text' })
  path: string;
}
