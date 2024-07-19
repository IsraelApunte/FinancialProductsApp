import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponent } from './product-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent, HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Component initializes and calls loadProducts on ngOnInit
  it('should call loadProducts on ngOnInit', function () {
    const productServiceMock = jasmine.createSpyObj('ProductService', ['getProducts']);
    const router = jasmine.createSpyObj('Router', ['navigate']);
    const component = new ProductListComponent(productServiceMock, router);
    spyOn(component, 'loadProducts');

    component.ngOnInit();

    expect(component.loadProducts).toHaveBeenCalled();
  });

  // No products are returned from the service
  it('should handle no products returned from the service', function () {
    const productServiceMock = jasmine.createSpyObj('ProductService', ['getProducts']);
    const router = jasmine.createSpyObj('Router', ['navigate']);
    productServiceMock.getProducts.and.returnValue(of({ data: [] }));
    const component = new ProductListComponent(productServiceMock, router);

    component.loadProducts();

    expect(component.products.length).toBe(0);
    expect(component.countResults).toBe(0);
    expect(component.displayedProducts.length).toBe(0);
  });

  // Handles empty products array
  it('should handle empty products array', function () {
    component.products = [];
    component.searchText = 'ap';
    component.itemsPerPage = 10;

    component.filteredProducts();

    expect(component.displayedProducts).toEqual([]);
    expect(component.countResults).toBe(0);
  });


  // Calls filteredProducts when itemsPerPage changes
  it('should call filteredProducts when itemsPerPage changes', function () {
    spyOn(component, 'filteredProducts');
    component.onItemsPerPageChange();
    expect(component.filteredProducts).toHaveBeenCalled();
  });

  
});
