import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ProductosService } from '../services/productos.service';
import { NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  categoriasSeleccionadas: number[] = []; // Categorías seleccionadas por el usuario

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

  // Método para agregar productos al carrito
  addToCart(product: any): void {
    this.cartService.addToCart(product);
    alert(`${product.producto_nombre} agregado al carrito`);
  }

  // Método para manejar la paginación
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
  
  // Método para actualizar las categorías seleccionadas
  actualizarCategoriasSeleccionadas(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const categoriaId = parseInt(checkbox.value, 10);
  
    if (checkbox.checked) {
      // Añade el ID de la categoría al array si el checkbox está marcado
      this.categoriasSeleccionadas.push(categoriaId);
    } else {
      // Elimina el ID de la categoría si el checkbox está desmarcado
      this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(
        (id) => id !== categoriaId
      );
    }

  // Filtra los productos después de actualizar las categorías seleccionadas
  this.filtrarProductos();
}

  // Método para filtrar los productos
  filtrarProductos(): void {
    if (this.categoriasSeleccionadas.length === 0) {
      // Si no hay categorías seleccionadas, muestra todos los productos
      this.productosPaginados = [...this.productos];
    } else {
      // Filtrar los productos según los IDs de categoría seleccionados
      const productosFiltrados = this.productos.filter((producto) =>
        this.categoriasSeleccionadas.includes(producto.categoria_id)
      );
      this.totalPages = Math.ceil(productosFiltrados.length / this.pageSize);
      this.currentPage = 1; // Reinicia a la primera página
      this.productosPaginados = productosFiltrados.slice(0, this.pageSize);
    }
  }

  // Método para cargar productos filtrados por categorías seleccionadas
  cargarProductosPorCategoria(): void {
    const categoria = this.categoriasSeleccionadas[0]; // Actualmente seleccionamos la primera categoría
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

  // Obtener un array de páginas para mostrar botones de paginación
  getPages(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const maxPagesToShow = 5;
    let startPage: number, endPage: number;
  
    if (totalPages <= maxPagesToShow) {
      // Si el total de páginas es menor o igual al máximo de páginas a mostrar
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calcula las páginas de inicio y fin
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
  
    // Genera un array de páginas desde startPage hasta endPage
    return Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }
  

}
