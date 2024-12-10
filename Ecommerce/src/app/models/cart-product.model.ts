// src/app/models/cart-product.model.ts

export interface CartProduct {
  producto_id: number;
  modelo_id: number;
  talla: string;
  stock: number;
  producto_nombre: string;
  descripcion: string;
  precio: number;
  marca_nombre: string;
  categoria_nombre: string;
  imagenes: string; // Base64 string o URL
}

export interface CartProductDisplay extends CartProduct {
  cantidad: number;
}
