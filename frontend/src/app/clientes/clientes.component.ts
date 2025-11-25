import { Component } from '@angular/core';
import { Cliente, MostrarClientes } from './services/mostrarClientes.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule],
  templateUrl: './clientes.component.html',
})
export default class Clientes {
  clientes: Cliente[] = [];
  loading: boolean = true;

  constructor(private mostrarClientes: MostrarClientes) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading = true;
    this.mostrarClientes.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando clientes:', error);
        this.loading = false;
      },
    });
  }
  editarCliente(cliente: Cliente): void {
    // Implementación simple con prompt - puedes mejorar con un modal
    const nuevoNombre = prompt('Nuevo nombre del cliente:', cliente.nombre_cliente);
    const nuevaCedula = prompt('Nueva cédula:', cliente.cedula || '');
    const nuevaDireccion = prompt('Nueva dirección:', cliente.direccion || '');
    const nuevoTelefono = prompt('Nuevo teléfono:', cliente.telefono || '');
    const nuevaCiudad = prompt('Nueva ciudad:', cliente.ciudad);

    if (nuevoNombre !== null) {
      const datosActualizados = {
        nombre_cliente: nuevoNombre,
        cedula: nuevaCedula || cliente.cedula,
        direccion: nuevaDireccion || cliente.direccion,
        telefono: nuevoTelefono || cliente.telefono,
        ciudad: nuevaCiudad || cliente.ciudad,
      };

      this.mostrarClientes.actualizarCliente(cliente.id, datosActualizados).subscribe({
        next: () => {
          alert('Cliente actualizado exitosamente');
          this.cargarClientes(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error actualizando cliente:', error);
          alert('Error al actualizar el cliente: ' + (error.error?.message || error.message));
        },
      });
    }
  }

  eliminarCliente(id: number, nombre: string): void {
    const confirmacion = confirm(
      `¿Está seguro de que desea eliminar al cliente "${nombre}"?\n\n` +
        'ADVERTENCIA: Esta acción también eliminará todas las facturas y detalles de factura asociados a este cliente. Esta acción no se puede deshacer.'
    );

    if (confirmacion) {
      this.mostrarClientes.eliminarCliente(id).subscribe({
        next: () => {
          alert('Cliente eliminado exitosamente');
          this.cargarClientes(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error eliminando cliente:', error);
          alert('Error al eliminar el cliente: ' + (error.error?.message || error.message));
        },
      });
    }
  }
}
