import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  providedIn: 'root',
})
export class SubirFacturaPg {
  constructor(private http: HttpClient) {}

  crearFacturaConCliente(formData: FormData): Observable<any> {
    return new Observable((observer) => {
      // Primero crear/verificar el cliente
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
          // Si el error es 409 (cliente ya existe), entonces buscamos el cliente por cédula
          if (error.status === 409 && clienteData.cedula) {
            this.buscarClientePorCedula(clienteData.cedula).subscribe({
              next: (clienteExistente: any) => {
                if (clienteExistente.success) {
                  // Usamos el ID del cliente existente
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

  buscarClientePorCedula(cedula: number): Observable<any> {
    return this.http.get(`${environment.SUBIR_CLIENTE_pg}/cedula/${cedula}`);
  }

  continuarConFactura(formData: FormData, idCliente: number, observer: any) {
    // Ahora crear la factura con el ID del cliente
    const facturaData = JSON.parse(formData.get('facturaData') as string);
    facturaData.id_cliente = idCliente;

    const facturaFormData = new FormData();
    facturaFormData.append('facturaData', JSON.stringify(facturaData));
    facturaFormData.append('file', formData.get('file') as File);

    this.crearFacturaConArchivo(facturaFormData).subscribe({
      next: async (facturaResponse: any) => {
        if (facturaResponse.success) {
          // Procesar productos y detalles
          try {
            const productosArray = facturaData.productos.split(',').map((p: string) => p.trim());
            const cantidadesArray = facturaData.cantidad
              .split(',')
              .map((c: string) => parseInt(c.trim(), 10));

            await this.procesarProductosYDetalles(
              productosArray,
              cantidadesArray,
              facturaResponse.data.id
            );

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
    // Usar query parameter en lugar de path parameter
    return this.http.get(
      `${environment.SUBIR_PRODUCTO_pg}/buscar?nombre=${encodeURIComponent(nombre)}`
    );
  }

  // Y actualizar el método procesarProductosYDetalles para que maneje mejor los errores
  async procesarProductosYDetalles(
    productos: string[],
    cantidades: number[],
    idFactura: number
  ): Promise<void> {
    // Validar que productos y cantidades tengan la misma longitud
    if (productos.length !== cantidades.length) {
      throw new Error('La cantidad de productos y cantidades no coincide');
    }

    for (let i = 0; i < productos.length; i++) {
      const nombreProducto = productos[i];
      const cantidad = cantidades[i];

      // Validar que el nombre del producto no esté vacío
      if (!nombreProducto || nombreProducto.trim() === '') {
        console.warn(`Producto en posición ${i} está vacío, saltando...`);
        continue;
      }

      try {
        // Buscar producto por nombre
        const productoResponse = await this.buscarProductoPorNombre(nombreProducto).toPromise();

        let productoId: number;

        if (productoResponse && productoResponse.success && productoResponse.data) {
          // Producto encontrado
          productoId = productoResponse.data.id;
          console.log(`Producto encontrado: ${nombreProducto} con ID: ${productoId}`);
        } else {
          // Crear nuevo producto
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

        // Crear detalle de factura
        const detalleData = {
          id_factura: idFactura,
          id_producto: productoId,
          cantidad: cantidad,
        };

        await this.crearFacturaDetalle(detalleData).toPromise();
        console.log(`Detalle creado para producto ID: ${productoId} con cantidad: ${cantidad}`);
      } catch (error) {
        console.error(`Error procesando producto "${nombreProducto}":`, error);
        // Decidir si continuar con los siguientes productos o lanzar error
        // throw error; // Descomenta si quieres que falle todo el proceso
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
