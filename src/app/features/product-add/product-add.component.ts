import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { releaseDateValidator } from '../../core/validators/custom-date-validator';
import { Router } from '@angular/router';
import { Product } from '../../core/models/product.model';
@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css'
})
export class ProductAddComponent implements OnInit {
  public registroForm: FormGroup;
  public state: any;
  public flagToCreate = false;
  public router = inject(Router);
  public location = inject(Location);
  public fb = inject(FormBuilder);
  public productService = inject(ProductService);

  constructor() {
    const navigation = this.router?.getCurrentNavigation();
    this.state = navigation?.extras?.state as { product: Product };
    this.registroForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, releaseDateValidator()]],
      date_revision: [{ value: '', disabled: true }, Validators.required],
    },);
  }

  ngOnInit(): void {
    this.onChangeDateRelease();
    /* The line `this.flagToCreate is a flag to know if componet have to create 
    when is true o edit when is false */
    this.flagToCreate = this.state ? false : true;
    if (!this.flagToCreate) {
      this.registroForm.patchValue(this.state);
    }
  }

  onReset() {
    this.registroForm.reset();
  }

  goToList() {
    this.location.back();
  }

  onChangeDateRelease() {
    this.registroForm.get('date_release')?.valueChanges.subscribe(dateRelease => {
      if (dateRelease) {
        const releaseDate = new Date(dateRelease);
        const revisionDate = new Date(releaseDate);
        revisionDate.setFullYear(releaseDate.getFullYear() + 1);
        this.registroForm.get('date_revision')?.setValue(revisionDate.toISOString().split('T')[0], { emitEvent: false });
      }
    });
  }

  onSubmit() {
    if (this.flagToCreate) {
      this.saveProduct();
    } else {
      this.editProduct();
    }

  }

  saveProduct() {
    const productId = this.registroForm.get('id')?.value;
    this.productService.verifyProductId(productId).subscribe((exists: boolean) => {
      if (exists) {
        alert('El producto ya existe.');
      } else {
        this.registroForm.value['date_revision'] = this.registroForm.controls['date_revision']?.value
        this.productService.addProduct(this.registroForm.value).subscribe((data: any) => {
          alert('Se agregó correctamente');
          console.log('Esta es la respuesta', data);
        }, (error) => {
          console.error('Error al agregar el producto', error);
        });
      }
    }, (error: any) => {
      console.error('Error al verificar la existencia del producto', error);
    });
  }


  editProduct() {
    const productId = this.registroForm.get('id')?.value;
    if (!productId) {
      console.error('❌ Error: El ID del producto es requerido para actualizar.');
      return;
    }

    const updatedProduct: Product = {
      id: productId,
      name: this.registroForm.get('name')?.value,
      description: this.registroForm.get('description')?.value,
      logo: this.registroForm.get('logo')?.value,
      date_release: this.registroForm.get('date_release')?.value,
      date_revision: this.registroForm.get('date_revision')?.value,
    };

    this.productService.updateProduct(productId, updatedProduct).subscribe(
      (response: Product) => {
        alert('✅ Producto actualizado correctamente.');
        console.log('🔄 Respuesta de actualización:', response);
      },
      (error) => {
        console.error('🚨 Error al actualizar el producto', error);
      }
    );
  }

}
