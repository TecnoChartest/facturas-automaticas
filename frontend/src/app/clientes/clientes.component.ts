import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ClienteService, Cliente } from './services/cliente.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  filteredClientes: Cliente[] = [];
  searchForm: FormGroup;
  addForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private clienteService: ClienteService) {
    this.searchForm = this.fb.group({
      search: [''],
    });

    this.addForm = this.fb.group({
      nombre_cliente: ['', Validators.required],
      ciudad: ['', Validators.required],
      cedula: [''],
      direccion: [''],
      telefono: [''],
      email: [''],
    });
  }

  ngOnInit(): void {
    this.loadClientes();

    // Filtrado en tiempo real
    this.searchForm.get('search')?.valueChanges.subscribe((value) => {
      this.applyFilter(value);
    });
  }

  loadClientes() {
    this.clienteService.getClientes().subscribe((data) => {
      this.clientes = data;
      this.filteredClientes = [...data];
    });
  }

  applyFilter(value: string) {
    if (!value) {
      this.filteredClientes = [...this.clientes];
    } else {
      this.filteredClientes = this.clientes.filter((c) =>
        c.nombre_cliente.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  get searchControl(): FormControl {
    return this.searchForm.get('search') as FormControl;
  }


  addCliente() {
    if (this.addForm.invalid) return;

    this.loading = true;
    this.error = null;

    this.clienteService.createCliente(this.addForm.value).subscribe({
      next: (cliente) => {
        this.loading = false;
        this.clientes.push(cliente);
        this.applyFilter(this.searchForm.get('search')?.value || '');
        this.addForm.reset();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al agregar cliente';
      },
    });
  }
}
