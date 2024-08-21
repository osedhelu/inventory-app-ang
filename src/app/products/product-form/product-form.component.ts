import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent implements OnInit {
  product = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    category: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    stock: new FormControl(0, [Validators.required, Validators.min(0)]),
    available: new FormControl(false)
  });

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const productId = +id;
      this.productService.getProducts().subscribe(products => {
        const existingProduct = products.find(p => p.id === productId);
        if (existingProduct) {
          this.product.setValue(existingProduct);
        }
      });
    }
  }
  getFormTitle(): string {
    return this.product.get('id')?.value == 0 ? 'Nuevo producto' : 'Editar'
  }
  onInputChange(event: any): void {
    const input = event.target as HTMLInputElement;
    const controlName = input.getAttribute('formControlName') ?? ''; // Si es null, usa una cadena vacía
    if (controlName && input.value.startsWith('0') && input.value.length > 1) {
      const newValue = input.value.substring(1);
      this.product.get(controlName)?.setValue(newValue, { emitEvent: false });
    }
  }
  onSubmit(): void {
    console.log(this.product.value)
    if (this.product.get('id')?.value === 0) {
      this.productService.addProduct(this.product.value as Product);
    } else {
      this.productService.updateProduct(this.product.value as Product);
    }
    this.router.navigate(['/products']);
  }
}
