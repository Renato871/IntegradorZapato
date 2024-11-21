import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ProductosService } from '../services/productos.service';
import { RouterModule } from '@angular/router';

import { NgFor } from '@angular/common';
@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [NgFor, RouterModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: any[] = []; // Array para almacenar productos obtenidos del backend
  pageSize = 8  ; // Tamaño de la página para la paginación
  currentPage = 1; // Página actual
  totalPages = 0; // Total de páginas, se calculará una vez se carguen los productos
  productosPaginados: any[] = []; // Productos a mostrar por página

  constructor(
    private cartService: CartService,
    private productosService: ProductosService // Inyectar el servicio de productos
  ) {}

  ngOnInit(): void {
    this.cargarProductos(); // Cargar los productos desde el backend cuando se inicializa el componente
  }

  // Método para cargar los productos desde el backend
  cargarProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.totalPages = Math.ceil(this.productos.length / this.pageSize);
        console.log('Productos obtenidos:', this.productos); // Imprime el array en la consola
        this.cargarPagina(this.currentPage);
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      },
      complete: () => {
      
        // Opcional: código que se ejecuta cuando el Observable se completa
      }
    });     
  }

  // Método para manejar la paginación
  cargarPagina(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.productosPaginados = this.productos.slice(startIndex, endIndex);
  }

  // Método para agregar productos al carrito
  addToCart(product: any): void {
    this.cartService.addToCart(product);
    alert(`${product.producto_nombre} agregado al carrito`);
  }

  // Obtener un array de páginas para mostrar botones de paginación
  getPages(): number[] {
    return Array(this.totalPages).fill(0).map((_, index) => index + 1);
  }
}
