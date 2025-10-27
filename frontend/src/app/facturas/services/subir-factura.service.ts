import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SubirFacturaService {

  constructor(private http: HttpClient) {}

  postFactura(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.SUBIR_FACTURAS_n8n}`, formData);
  }
}
