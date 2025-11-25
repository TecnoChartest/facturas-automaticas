import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../../../../clientes/services/mostrarClientes.service';
import { environment } from '../../../../../environments/environment.development';

export interface FacturaDetalle {
  id: number;
  id_factura: number;
  item: number;
  description: string;
  cantidad: number;
}

export interface Factura {
  id: number;
  id_cliente: number;
  fechaGeneracion: string;
  fechaVencimiento: string;
  totalBruto: number;
  totalIva: number;
  totalPagar: number;
  metodoPago: string;
  path: string;
  cliente?: Cliente;
  detalles?: FacturaDetalle[];
}

@Injectable({
  providedIn: 'root'
})
export class MostrarFactura {
  private apiUrl = environment.SUBIR_FACTURA_pg;

  constructor(private http: HttpClient) { }

  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.apiUrl);
  }
}
