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
}
