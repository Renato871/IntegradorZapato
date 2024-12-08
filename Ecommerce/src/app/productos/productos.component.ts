import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ProductosService } from '../services/productos.service';
import { NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [NgFor, RouterModule, NgIf],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, OnDestroy {
  productos: any[] = [];
  pageSize = 8;
  currentPage = 1;
  totalPages = 0;
  productosPaginados: any[] = [];
  categoriasSeleccionadas: number[] = [];
  
  // Agregar una suscripción para manejar la suscripción al observable
  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private productosService: ProductosService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en los parámetros de la ruta
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const genero = String(params.get('genero'));
      this.cargarProductos(genero);
    });
  }

  ngOnDestroy(): void {
    // Asegurarse de desuscribirse para evitar fugas de memoria
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  // Modificar el método para recibir el genero como parámetro
  cargarProductos(genero: string): void {
    let generoc: string;
    if (genero === 'hombre') {
      generoc = 'masculino';
    } else {
      generoc = 'femenino';
    }
    this.productosService.getProductos(generoc).subscribe({
      next: (data) => {
        this.productos = data;
        this.totalPages = Math.ceil(this.productos.length / this.pageSize);
        this.cargarPagina(this.currentPage);
        console.log(this.productos)
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      }
    });
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
    alert(`${product.producto_nombre} agregado al carrito`);
  }

  cargarPagina(page: number): void {
    if (page < 1) {
      page = 1;
    } else if (page > this.totalPages) {
      page = this.totalPages;
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.productosPaginados = this.productos.slice(startIndex, endIndex);
  }

  actualizarCategoriasSeleccionadas(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const categoriaId = parseInt(checkbox.value, 10);

    if (checkbox.checked) {
      this.categoriasSeleccionadas.push(categoriaId);
    } else {
      this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(
        (id) => id !== categoriaId
      );
    }

    this.filtrarProductos();
  }

  filtrarProductos(): void {
    if (this.categoriasSeleccionadas.length === 0) {
      this.productosPaginados = [...this.productos];
    } else {
      const productosFiltrados = this.productos.filter((producto) =>
        this.categoriasSeleccionadas.includes(producto.categoria_id)
      );
      this.totalPages = Math.ceil(productosFiltrados.length / this.pageSize);
      this.currentPage = 1;
      this.productosPaginados = productosFiltrados.slice(0, this.pageSize);
    }
  }

  cargarProductosPorCategoria(): void {
    const categoria = this.categoriasSeleccionadas[0];
    this.productosService.getProductosByCategoria(categoria).subscribe({
      next: (data) => {
        this.productos = data;
        this.totalPages = Math.ceil(this.productos.length / this.pageSize);
        this.cargarPagina(this.currentPage);
      },
      error: (error) => {
        console.error('Error al filtrar productos por categoría:', error);
      }
    });
  }

  getPages(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const maxPagesToShow = 5;
    let startPage: number, endPage: number;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
      if (currentPage <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }

    return Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }
}
