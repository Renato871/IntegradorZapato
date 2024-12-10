import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../services/productos.service';
import { ActivatedRoute } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { CartService } from '../services/cart.service';
import { Location } from '@angular/common';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-item',
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  product: any;
  imagenes: any;
  products: any;
  tallas: any;
  selectedTalla : any;
  selectedImageIndex: number = 0;
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
        this.products = data.producto; // Almacena los productos obtenidos
        this.imagenes = data.imagenes; // Almacena las imagenes  obtenidos
        this.product = this.products[0]; // Solo la primera fila para detalles generales
        // Crear un mapa para almacenar stock por talla
        const tallaMap = new Map<string, number>();
        this.products.forEach((p: any) => {
          if (!tallaMap.has(p.talla)) {
            tallaMap.set(p.talla, p.stock);
          }
        },
        
      );

        // Convertir el mapa a un array de objetos
        this.tallas = Array.from(tallaMap.entries())
          .map(([talla, stock]) => ({ talla, stock }))
          .sort((a, b) => Number(a.talla) - Number(b.talla));    
        // console.log('Modelos obtenidos:', this.product); // Imprime los productos en la consola
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      },
      complete: () => {
        // OCodigo completado
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
    const productoSeleccionado = this.products.find((p: any) => p.talla === this.selectedTalla);
  
    if (productoSeleccionado) {
      console.log('El producto seleccionado fue este ID: ' + productoSeleccionado.producto_id);
      
      // Enviar solo el producto_id al servicio de carrito
      this.cartService.addToCart(productoSeleccionado.producto_id);
      
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
    this.selectedTalla = talla; // P Almacena la tabla seleccionada
  }
  
}

