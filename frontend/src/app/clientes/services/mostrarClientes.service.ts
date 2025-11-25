import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

export interface Cliente {
  id: number;
  cedula: string;
  nombre_cliente: string;
  direccion: string;
  telefono: string;
  ciudad: string;
  facturas: any[];
}

@Injectable({
  providedIn: 'root',
})
export class MostrarClientes {
  private apiUrl = environment.SUBIR_CLIENTE_pg;

  constructor(private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }
}
