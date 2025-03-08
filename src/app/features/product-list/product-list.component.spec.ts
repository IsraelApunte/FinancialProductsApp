import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        ProductService,
        Router,
      ],
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

  // Logs 'Error 400: Bad Request' when a 400 error occurs
  it('should log "Error 400: Bad Request" when a 400 error occurs', function () {
    const mockProductService = jasmine.createSpyObj('ProductService', ['getProducts']);
    const router = jasmine.createSpyObj('Router', ['navigate']);
    const mockError = { status: 400 };
    spyOn(console, 'error');
    mockProductService.getProducts.and.returnValue(throwError(mockError));

    const component = new ProductListComponent(mockProductService, router);
    component.loadProducts();

    expect(console.error).toHaveBeenCalledWith('Error 400: Bad Request', mockError);
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

  // Detects right mouse click and displays context menu
  it('should display context menu when right mouse button is clicked', function () {
    const event = { which: 1, clientX: 100, clientY: 200 };
    const product = {
      id: "dos",
      name: "Nombre producto",
      description: "Descripción producto",
      logo: "assets-1.png",
      date_release: new Date(),
      date_revision: new Date()
    };
    component.detectRighMouseClick(event, product);
    expect(component.rightPanelStyle).toEqual({
      'display': 'block',
      'position': 'absolute',
      'left.px': 100,
      'top.px': 200
    });
    expect(component.currentProduct).toBe(product);
  });

  // closeContextMenu sets rightPanelStyle display to none
  it('should set rightPanelStyle display to none when called', function () {
    component.closeContextMenu();
    expect(component.rightPanelStyle.display).toBe('none');
  });

  // Sets isModalVisible to true when confirmDeleteProduct is called
  it('should set isModalVisible to true when called', () => {
    // Arrange
    component.isModalVisible = false;
    // Act
    component.confirmDeleteProduct();
    // Assert
    expect(component.isModalVisible).toBe(true);
  });

  // Sets isModalVisible to false when called
  it('should set isModalVisible to false when called', () => {
    // Arrange
    component.isModalVisible = true;
    // Act
    component.onCancel();
    // Assert
    expect(component.isModalVisible).toBe(false);
  });

  it('✅ Debe eliminar un producto exitosamente', () => {
    // Crear un mock del servicio con Jasmine
    const productServiceMock = jasmine.createSpyObj('ProductService', ['deleteProduct']);

    // Crear un producto de prueba
    const mockProduct: Product = {
      id: 'dos',
      name: 'Producto de prueba',
      description: 'Descripción del producto',
      logo: 'logo.png',
      date_release: new Date('2024-01-01'),
      date_revision: new Date('2025-01-01'),
    };

    // Asignar el producto actual en el componente
    component.currentProduct = mockProduct;

    // Simular que el servicio responde exitosamente con un observable vacío
    productServiceMock.deleteProduct.and.returnValue(of(undefined));

    // Espiar el método loadProducts para verificar que se llama después de eliminar
    spyOn(component, 'loadProducts');

    // Inyectar el servicio mock al componente (suponiendo que sea por inyección de dependencias)
    component['productService'] = productServiceMock;

    // Ejecutar la función deleteProduct
    component.deleteProduct();

    // Verificar que el servicio fue llamado con el ID correcto
    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith('dos');

    // Verificar que loadProducts fue llamado después de eliminar el producto
    expect(component.loadProducts).toHaveBeenCalled();
  });

  it('Should not attempt deletion if the product is null', () => {
    // Create a mock service with Jasmine
    const productServiceMock = jasmine.createSpyObj('ProductService', ['deleteProduct']);

    // Inject the mock service into the component
    component['productService'] = productServiceMock;

    // Set `currentProduct` to null
    component.currentProduct = null;

    // Spy on console.error to verify error logging
    spyOn(console, 'error');

    // Execute the function
    component.deleteProduct();

    // Ensure `deleteProduct` was NOT called because `currentProduct` is null
    expect(productServiceMock.deleteProduct).not.toHaveBeenCalled();

    // Verify that the error message was logged
    expect(console.error).toHaveBeenCalledWith('❌ Error: El ID del producto es undefined.');
  });


 






});
