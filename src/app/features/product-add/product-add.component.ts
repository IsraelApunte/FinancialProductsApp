import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { releaseDateValidator } from '../../core/validators/custom-date-validator';
@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css'
})
export class ProductAddComponent implements OnInit {
  public registroForm: FormGroup;
  public errorMessage = '';

  constructor(
    public fb: FormBuilder,
    public productService: ProductService,
    private location: Location,
  ) {
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
  }

  onSubmit() {
    const productId = this.registroForm.get('id')?.value;
    this.productService.verifyProductId(productId).subscribe((exists: boolean) => {
      if (exists) {
        alert('El producto ya existe.');
      } else {
        this.registroForm.value['date_revision'] = this.registroForm.controls['date_revision'].value
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

}
