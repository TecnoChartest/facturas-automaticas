import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface Factura {
  id: string;
  productos: string;
  fechaGeneracion: Date;
  fechaVencimiento: Date;
  totalBruto: number;
  totalIva?: number;
  totalPagar: number;
  metodoPago: string;
  path: string;
  nombreCliente: string;
  cedula: string;
  direccion: string;
  telefono: string;
  ciudad: string;
}

@Injectable({
  providedIn: 'root'
})

export class SubirFacturaPg {
  constructor(private http: HttpClient) { }

  crearFacturaConArchivo(formData: FormData): Observable<any> {
  return this.http.post(`${environment.SUBIR_FACTURA_pg}`, formData);
}
}
