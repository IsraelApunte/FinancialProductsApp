import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { releaseDateValidator } from '../../../core/validators/custom-date-validator';
@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css'
})
export class ProductAddComponent {
  public registroForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private location: Location,
  ) {
    this.registroForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, releaseDateValidator()]],
      date_revision: ['', Validators.required]
    });
  }

  onSubmit() {
    this.productService.addProduct(this.registroForm.value).subscribe((data: any) => {
      alert('Se agrego correctamente')
      console.log('Esta es la respuesta');
    });
  }

  onReset() {
    this.registroForm.reset();
  }

  goToList() {
    this.location.back();
  }

}
