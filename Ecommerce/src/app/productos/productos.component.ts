import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [NgFor],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  productos = [
    { id: 1, nombre: 'Sneaker A', precio: 100, descripcion: 'Sneaker de calidad A', descuento: '30%', imagen: 'https://via.placeholder.com/150' },
    { id: 2, nombre: 'Sneaker B', precio: 120, descripcion: 'Sneaker de calidad B', descuento: '20%', imagen: 'https://via.placeholder.com/150' },
    { id: 3, nombre: 'Sneaker C', precio: 140, descripcion: 'Sneaker de calidad C', descuento: '10%', imagen: 'https://via.placeholder.com/150' },
    { id: 4, nombre: 'Sneaker D', precio: 160, descripcion: 'Sneaker de calidad D', descuento: '25%', imagen: 'https://via.placeholder.com/150' },
    { id: 5, nombre: 'Sneaker E', precio: 180, descripcion: 'Sneaker de calidad E', descuento: '15%', imagen: 'https://via.placeholder.com/150' },
    { id: 6, nombre: 'Sneaker F', precio: 200, descripcion: 'Sneaker de calidad F', descuento: '5%', imagen: 'https://via.placeholder.com/150' },
    { id: 7, nombre: 'Sneaker G', precio: 220, descripcion: 'Sneaker de calidad G', descuento: '35%', imagen: 'https://via.placeholder.com/150' },
    { id: 8, nombre: 'Sneaker H', precio: 240, descripcion: 'Sneaker de calidad H', descuento: '40%', imagen: 'https://via.placeholder.com/150' },
    { id: 9, nombre: 'Sneaker I', precio: 260, descripcion: 'Sneaker de calidad I', descuento: '50%', imagen: 'https://via.placeholder.com/150' },
    { id: 10, nombre: 'Sneaker J', precio: 280, descripcion: 'Sneaker de calidad J', descuento: '10%', imagen: 'https://via.placeholder.com/150' }
  ];

  pageSize = 8;
  currentPage = 1;
  totalPages = Math.ceil(this.productos.length / this.pageSize);
  productosPaginados: any[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cargarPagina(this.currentPage);
  }

  cargarPagina(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.productosPaginados = this.productos.slice(startIndex, endIndex);
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    alert(`${product.nombre} agregado al carrito`);
  }

  getPages(): number[] {
    return Array(this.totalPages).fill(0).map((_, index) => index + 1);
  }
}
