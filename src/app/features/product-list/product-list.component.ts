import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { messages } from '../../messages/messages';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { DefaultImagePipe } from '../../core/pipe/default-image.pipe';
import { TooltipDirective } from '../../core/directives/tooltip.directive';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DefaultImagePipe,
    TooltipDirective
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  public products: Product[] = [];
  public displayedProducts: Product[] = [];
  public countResults = 0;
  public searchText = '';
  public messages = messages;
  public itemsPerPage = 5;
  public rightPanelStyle: any;
  public currentProduct: Product | null = null;
  public isModalVisible = false;
  constructor(
    private productService: ProductService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.closeContextMenu();
  }

  loadProducts() {
    this.productService.getProducts().pipe(
      tap((response: any) => {
        if (response.data) {
          this.products = response.data;
          this.countResults = this.products.length;
          this.onItemsPerPageChange();
        }
      }),
      catchError((error) => {
        console.error('🚨 Error al cargar productos:', error);
        if (error.status === 400) {
          console.error('Error 400: Bad Request', error);
        } else {
          console.error('Error inesperado 💀', error);
        }
        // Return a void observable to keep the flow going
        return of([]);
      })
    ).subscribe();
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

  detectRighMouseClick($event: any, product: any) {
    console.log('dsfs', $event, product);
    if ($event.which === 1) {
      this.rightPanelStyle = {
        'display': 'block',
        'position': 'absolute',
        'left.px': $event.clientX,
        'top.px': $event.clientY
      };
      this.currentProduct = product;
    }
  }

  closeContextMenu() {
    this.rightPanelStyle = {
      'display': 'none',
    };
  }

  goToEdit() {
    const productToEdit = { ...this.currentProduct };
    this.router
      .navigate(['/products/add'], { state: productToEdit || {} })
      .then();
  }

  confirmDeleteProduct() {
    this.isModalVisible = true;
  }

  onCancel() {
    this.isModalVisible = false;
  }

  deleteProduct() {
    this.isModalVisible = false;
    console.log('Este producto voy a eliminar', this.currentProduct);
    const id = this.currentProduct?.id;
    if (!id) {
      console.error('❌ Error: El ID del producto es undefined.');
      return;
    }
    this.productService.deleteProduct(id).pipe(
      tap((response) => {
        console.log('✅ Producto eliminado:', response);
        this.loadProducts(); // Recargar la lista después de eliminar
      }),
      catchError((error) => {
        console.error('🚨 Error al eliminar producto:', error);
        if (error.status === 404) {
          console.error('❌ Error 404: Producto no encontrado', error.error?.message || '');
        } else {
          console.error('💀 Error inesperado', error);
        }
        return of(null);
      })
    ).subscribe();
  }
}
