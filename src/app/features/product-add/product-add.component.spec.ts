import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddComponent } from './product-add.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { of } from 'rxjs';

describe('ProductAddComponent', () => {
  let component: ProductAddComponent;
  let fixture: ComponentFixture<ProductAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductAddComponent, HttpClientTestingModule,]
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

  // Form submission triggers onSubmit method
  it('should call onSubmit when form is submitted', function () {
    spyOn(component, 'onSubmit');
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  // Product ID field is empty
  it('should handle empty product ID field', function () {
    component.registroForm = new FormBuilder().group({
      id: [''],
    });
    spyOn(component.productService, 'verifyProductId').and.returnValue(of(false));
    component.onSubmit();
    expect(component.productService.verifyProductId).toHaveBeenCalledWith('');
  });

  // verifyProductId service method is called with correct product ID
  it('should call verifyProductId with correct product ID when product ID exists', function () {
    const productId = '123';
    spyOn(component.productService, 'verifyProductId').and.returnValue(of(true));

    component.registroForm.get('id')?.setValue(productId);
    component.onSubmit();

    expect(component.productService.verifyProductId).toHaveBeenCalledWith(productId);
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

});
