import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  public products: Product[] = [];
  public countResults: number = 0;
  public searchTerm: string = '';
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data: any) => {
      console.log('Esta es la respuesta', data);
      this.products = data.data;
      this.countResults = this.products.length;
    });
  }

  filteredProducts(): Product[] {
    const filtro = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    this.products = filtro;
    return filtro;
  }

}
