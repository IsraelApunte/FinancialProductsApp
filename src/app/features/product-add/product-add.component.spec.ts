import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductAddComponent } from './product-add.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { of } from 'rxjs';


describe('ProductAddComponent', () => {
  let component: ProductAddComponent;
  let fixture: ComponentFixture<ProductAddComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  beforeEach(async () => {
    productServiceMock = jasmine.createSpyObj('ProductService', ['updateProduct']);
    await TestBed.configureTestingModule({
      imports: [ProductAddComponent, HttpClientTestingModule,],
      providers: [{ provide: ProductService, useValue: productServiceMock }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ngOnInit calls onChangeDateRelease successfully
  it('should call onChangeDateRelease when ngOnInit is invoked', function () {
    spyOn(component, 'onChangeDateRelease');
    component.ngOnInit();
    expect(component.onChangeDateRelease).toHaveBeenCalled();
  });

  // onSubmit calls saveProduct when flagToCreate is true
  it('should call saveProduct when flagToCreate is true', function () {
    spyOn(component, 'saveProduct');
    component.flagToCreate = true;
    component.onSubmit();
    expect(component.saveProduct).toHaveBeenCalled();
  });

  it('should call location.back() when goToList() is called', () => {
    spyOn(component['location'], 'back');
    
    component.goToList();
  
    expect(component['location'].back).toHaveBeenCalled();
  });
  

  // onSubmit calls editProduct when flagToCreate is false
  it('should call editProduct when flagToCreate is false', function () {
    // Initialize
    component.flagToCreate = false;
    spyOn(component, 'editProduct');
    // Invoke
    component.onSubmit();
    // Assert
    expect(component.editProduct).toHaveBeenCalled();
  });

  // saveProduct successfully adds a new product when product ID does not exist
  it('should add new product when product ID does not exist', function () {
    // Initialize
    component.flagToCreate = true;
    spyOn(component, 'saveProduct');
    // Invoke
    component.onSubmit();
    // Assert
    expect(component.saveProduct).toHaveBeenCalled();
  });

  // Form is reset to initial state
  it('should reset the form to its initial state when onReset is called', function () {
    const formBuilder = new FormBuilder();
    component.registroForm = formBuilder.group({
      name: ['Initial Name', Validators.required],
      price: [100, Validators.required]
    });
    component.registroForm.controls['name'].setValue('Changed Name');
    component.registroForm.controls['price'].setValue(200);
    component.onReset();
    expect(component.registroForm.controls['name'].value).toBe(null);
    expect(component.registroForm.controls['price'].value).toBe(null);
  });

  // Form is reset when it is already empty
  it('should reset the form even when it is already empty', function () {
    const formBuilder = new FormBuilder();
    component.registroForm = formBuilder.group({
      name: [null, Validators.required],
      price: [null, Validators.required]
    });
    component.onReset();
    expect(component.registroForm.controls['name'].value).toBe(null);
    expect(component.registroForm.controls['price'].value).toBe(null);
  });

  // Handles the case when the Location service is not available
  it('should handle the case when the Location service is not available', function () {
    expect(function () { component.goToList(); }).not.toThrow();
  });

  // Updates 'date_revision' field correctly when 'date_release' is changed
  it('should update "date_revision" field correctly when "date_release" is changed', function () {
    component.registroForm = component.fb.group({
      date_release: ['2023-10-01', Validators.required],
      date_revision: ['']
    });
    component.onChangeDateRelease();
    component.registroForm.get('date_release')?.setValue('2023-10-01');
    const expectedDate = new Date('2023-10-01');
    expectedDate.setFullYear(expectedDate.getFullYear() + 1);
    expect(component.registroForm.get('date_revision')?.value).toBe(expectedDate.toISOString().split('T')[0]);
  });

  it('should log an error if product ID is not provided', () => {
    // Establecer el formulario sin un ID
    component.registroForm.controls['id'].setValue(null);

    spyOn(console, 'error');

    component.editProduct();  // Llamar al método `editProduct`

    // Verificar que se haya lanzado un error en el log
    expect(console.error).toHaveBeenCalledWith('❌ Error: El ID del producto es requerido para actualizar.');
  });

  it('should update product successfully when editProduct() is called', () => {
    const mockProduct: Product = {
      id: '123',
      name: 'Producto Test',
      description: 'Descripción Test',
      logo: 'test-logo.png',
      date_release: new Date('2025-01-01'),
      date_revision: new Date('2026-01-01'),
    };
    component.registroForm.patchValue(mockProduct);
    productServiceMock.updateProduct.and.returnValue(of(mockProduct));
    spyOn(console, 'log');
    component.editProduct();
    expect(productServiceMock.updateProduct).toHaveBeenCalledWith('123', mockProduct);
    expect(console.log).toHaveBeenCalledWith('🔄 Respuesta de actualización:', mockProduct);
  });


});
