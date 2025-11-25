import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface Cliente {
  id: number;
  cedula: string;
  nombre_cliente: string;
  direccion: string;
  telefono: string;
  ciudad: string;
}

@Injectable({
  providedIn: 'root',
})
export class MostrarClientes {
  private apiUrl = `${environment.SUBIR_CLIENTE_pg}`;

  constructor(private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  createCliente(cliente: Cliente): Observable<any> {
    return this.http.post(this.apiUrl, cliente);
  }

  getClienteByCedula(cedula: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cedula/${cedula}`);
  }

  // Nuevos métodos para editar y eliminar
  actualizarCliente(id: number, cliente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cliente);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  obtenerClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }
}
