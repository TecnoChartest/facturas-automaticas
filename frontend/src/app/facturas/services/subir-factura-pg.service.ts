import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface Factura {
  id: string;
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
  items?: FacturaItem[];
}

export interface FacturaItem {
  item: string;
  description: string;
  cantidad: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubirFacturaPg {
  constructor(private http: HttpClient) {}

  crearFacturaConCliente(formData: FormData): Observable<any> {
    return new Observable((observer) => {
      const clienteData = JSON.parse(formData.get('clienteData') as string);

      this.crearCliente(clienteData).subscribe({
        next: (clienteResponse: any) => {
          if (clienteResponse.success) {
            this.continuarConFactura(formData, clienteResponse.data.id, observer);
          } else {
            observer.error(clienteResponse.message);
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409 && clienteData.cedula) {
            this.buscarClientePorCedula(clienteData.cedula).subscribe({
              next: (clienteExistente: any) => {
                if (clienteExistente.success) {
                  this.continuarConFactura(formData, clienteExistente.data.id, observer);
                } else {
                  observer.error('No se pudo encontrar el cliente existente');
                }
              },
              error: (errorBusqueda) => {
                observer.error(errorBusqueda);
              },
            });
          } else {
            observer.error(error);
          }
        },
      });
    });
  }

  buscarClientePorCedula(cedula: string): Observable<any> {
    return this.http.get(`${environment.SUBIR_CLIENTE_pg}/cedula/${cedula}`);
  }

  continuarConFactura(formData: FormData, idCliente: number, observer: any) {
    const facturaData = JSON.parse(formData.get('facturaData') as string);
    facturaData.id_cliente = idCliente;

    const { items, ...facturaDataSinItems } = facturaData;

    const facturaFormData = new FormData();
    facturaFormData.append('facturaData', JSON.stringify(facturaDataSinItems));
    facturaFormData.append('file', formData.get('file') as File);

    this.crearFacturaConArchivo(facturaFormData).subscribe({
      next: async (facturaResponse: any) => {
        if (facturaResponse.success) {
          try {
            if (items && Array.isArray(items)) {
              await this.procesarItems(items, facturaResponse.data.id);
            }

            observer.next(facturaResponse);
            observer.complete();
          } catch (error) {
            observer.error(error);
          }
        } else {
          observer.error(facturaResponse.message);
        }
      },
      error: (error) => {
        observer.error(error);
      },
    });
  }

  buscarProductoPorNombre(nombre: string): Observable<any> {
    return this.http.get(
      `${environment.SUBIR_PRODUCTO_pg}/buscar?nombre=${encodeURIComponent(nombre)}`
    );
  }

  async procesarItems(items: any[], idFactura: number): Promise<void> {
    for (const item of items) {
      const nombreProducto = item.description;
      const cantidad = parseInt(item.cantidad, 10);

      if (!nombreProducto || nombreProducto.trim() === '') {
        console.warn(`Producto con item ${item.item} está vacío, saltando...`);
        continue;
      }

      if (isNaN(cantidad) || cantidad <= 0) {
        console.warn(`Cantidad inválida para producto "${nombreProducto}", saltando...`);
        continue;
      }

      try {
        const productoResponse = await this.buscarProductoPorNombre(nombreProducto).toPromise();

        let productoId: number;

        if (productoResponse && productoResponse.success && productoResponse.data) {
          productoId = productoResponse.data.id;
          console.log(`Producto encontrado: ${nombreProducto} con ID: ${productoId}`);
        } else {
          console.log(`Creando nuevo producto: ${nombreProducto}`);
          const nuevoProductoResponse = await this.crearProducto({
            nombre: nombreProducto.trim(),
          }).toPromise();

          if (nuevoProductoResponse && nuevoProductoResponse.success) {
            productoId = nuevoProductoResponse.data.id;
            console.log(`Producto creado: ${nombreProducto} con ID: ${productoId}`);
          } else {
            throw new Error(`Error al crear el producto: ${nombreProducto}`);
          }
        }

        const detalleData = {
          id_factura: idFactura,
          id_producto: productoId,
          cantidad: cantidad,
        };

        await this.crearFacturaDetalle(detalleData).toPromise();
        console.log(`Detalle creado para producto ID: ${productoId} con cantidad: ${cantidad}`);
      } catch (error) {
        console.error(`Error procesando producto "${nombreProducto}":`, error);
      }
    }
  }

  crearProducto(productoData: any): Observable<any> {
    return this.http.post(`${environment.SUBIR_PRODUCTO_pg}`, productoData);
  }

  crearFacturaDetalle(detalleData: any): Observable<any> {
    return this.http.post(`${environment.SUBIR_FACTURA_DETALLE_pg}`, detalleData);
  }

  crearCliente(clienteData: any): Observable<any> {
    return this.http.post(`${environment.SUBIR_CLIENTE_pg}`, clienteData);
  }

  crearFacturaConArchivo(formData: FormData): Observable<any> {
    return this.http.post(`${environment.SUBIR_FACTURA_pg}/upload`, formData);
  }
}
