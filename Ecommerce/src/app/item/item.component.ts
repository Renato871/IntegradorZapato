import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../services/productos.service';
import { ActivatedRoute } from '@angular/router';
import { NgFor } from '@angular/common';
import { CartService } from '../services/cart.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [NgFor],
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  product: any;

  constructor(
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private cartService: CartService,
    private location: Location
  ) {}

  ngOnInit() {
    // Obtener el ID del parámetro de la URL
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('id'+id); // Imprime el array en la consola
    // Obtener el producto por su ID
    this.productosService.getProductoById(id).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: (error) => {
        console.error('Error al obtener el producto:', error);
      },
      complete: () => {
        // Opcional
        console.log('Productos del item:', this.product); // Imprime el array en la consola
      }
    });
  }

  addToCart(): void {
    this.cartService.addToCart(this.product);
    alert(`${this.product.producto_nombre} agregado al carrito`);
  }

  goBack(): void {
    this.location.back();
  }
}
