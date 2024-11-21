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
  products: any;
  tallas: any;
  selectedTalla : any;
  constructor(
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private cartService: CartService,
    private location: Location
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('id'+id); 
    this.productosService.getProductoById(id).subscribe({
      next: (data) => {
        this.products = data; // Almacena los productos obtenidos
        this.product = this.products[0]; // Solo la primera fila para detalles generales
        this.tallas = Array.from(new Set<string>(this.products.map((p: any) => p.talla)))
        .sort((a, b) => Number(a) - Number(b));      
        console.log('Productos obtenidos:', this.product); // Imprime los productos en la consola
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      },
      complete: () => {
        // Opcional: código que se ejecuta cuando el Observable se completa
        console.log('Carga completa de productos por modelo_id.');
        
      }
    });
  }
  addToCart(): void {
    if (!this.selectedTalla) {
      alert('Por favor, selecciona una talla antes de agregar al carrito.');
      return;
    }
  
    // Buscar el producto que coincida con la talla seleccionada
    const productoSeleccionado = this.products.find((p: any)  => p.talla === this.selectedTalla);
  
    if (productoSeleccionado) {
      this.cartService.addToCart(productoSeleccionado);
      alert(`${productoSeleccionado.producto_nombre} con talla ${this.selectedTalla} agregado al carrito`);
    } else {
      alert('No se encontró un producto con la talla seleccionada.');
    }
  }
  

  goBack(): void {
    this.location.back();
  }
  selectTalla(talla: string) {
    console.log('Talla seleccionada:', talla);
    this.selectedTalla = talla; // Puedes guardar la talla seleccionada si es necesario
  }
  
}

