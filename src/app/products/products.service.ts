import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  private productsSubject = new BehaviorSubject<Product[]>(this.products);

  constructor() {
    // Ejemplo inicial de productos
    this.products = [
      { id: 1, name: 'Producto 1', description: 'Descripción 1', category: 'Categoría 1', price: 100, stock: 10, available: true },
      { id: 2, name: 'Producto 2', description: 'Descripción 2', category: 'Categoría 2', price: 200, stock: 0, available: false }
    ];
    this.productsSubject.next(this.products);
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  addProduct(product: Product): void {
    console.log("TCL: ProductService -> product", product)
    product.id = this.products.length + 1;
    this.products.push(product);
    this.productsSubject.next(this.products);
  }

  updateProduct(updatedProduct: Product): void {
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index > -1) {
      this.products[index] = updatedProduct;
      this.productsSubject.next(this.products);
    }
  }

  deleteProduct(productId: number): void {
    this.products = this.products.filter(p => p.id !== productId);
    this.productsSubject.next(this.products);
  }
}
