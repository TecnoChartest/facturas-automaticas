import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Cliente {
  id?: number;
  cedula?: number;
  nombre_cliente: string;
  ciudad: string;
  direccion?: string;
  telefono?: string;
  email?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = 'http://localhost:4000/clientes'; // tu backend

  constructor(private http: HttpClient) {}

  // Traer todos los clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<ApiResponse<Cliente[]>>(this.apiUrl).pipe(map(res => res.data));
  }

  // Crear un cliente
  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<ApiResponse<Cliente>>(this.apiUrl, cliente).pipe(map(res => res.data));
  }

  // Buscar cliente por cédula
  getClientePorCedula(cedula: number): Observable<Cliente | null> {
    return this.http.get<ApiResponse<Cliente>>(`${this.apiUrl}/cedula/${cedula}`).pipe(map(res => res.data));
  }

  // Buscar cliente por nombre (opcional)
  getClientePorNombre(nombre: string): Observable<Cliente | null> {
    return this.http.get<ApiResponse<Cliente>>(`${this.apiUrl}/nombre/${nombre}`).pipe(map(res => res.data));
  }
}
