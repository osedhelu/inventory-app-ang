import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchText: string = '';
  selectedCategory: string = '';
  displayedColumns: string[] = [];
  allCategory: string[] = []

  constructor(private productService: ProductService) { }

  ngOnInit(): void {

    this.productService.getProducts().subscribe(products => {
      this.displayedColumns = Object.keys(products[0]).filter(key => key !== 'id' && key !== 'description');
      this.displayedColumns.push('actions');
      this.products = products;
      products.forEach(product => {
        if (!this.allCategory.includes(product.category)) {
          this.allCategory.push(product.category);
        }
      });
    });
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId);
  }

  filterProducts(): Product[] {
    return this.products.filter(product => {
      return (
        (!this.selectedCategory || product.category === this.selectedCategory) &&
        (!this.searchText || product.name.toLowerCase().includes(this.searchText.toLowerCase()))
      );
    });
  }
}
