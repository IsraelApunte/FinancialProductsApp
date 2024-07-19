import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { messages } from '../../../messages/messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  public products: Product[] = [];
  public displayedProducts: Product[] = [];
  public countResults: number = 0;
  public searchText: string = '';
  public messages = messages;
  itemsPerPage: number = 5;
  constructor(
    private productService: ProductService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data.data;
      this.countResults = this.products.length;
      this.onItemsPerPageChange();
    });
  }

  filteredProducts() {
    if (this.searchText !== '') {
      const filterList = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchText.toLowerCase())).slice(0, this.itemsPerPage);
      this.displayedProducts = [...filterList];
      this.countResults = this.displayedProducts.length;
    } else {
      this.displayedProducts = [...this.products].slice(0, this.itemsPerPage);
      this.countResults = this.products.length;
    }
  }

  onItemsPerPageChange() {
    this.filteredProducts();
  }

  goToAddProduct() {
    this.router
      .navigate(['/products/add'])
      .then();
  }
}
