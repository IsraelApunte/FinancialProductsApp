import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    service = new ProductService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an observable of Product array when the HTTP request is successful', () => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() },
      { id: '2', name: 'Product 2', description: 'Description 2', logo: 'logo2.png', date_release: new Date(), date_revision: new Date() }
    ];

    httpClientSpy.get.and.returnValue(of(mockProducts));

    service.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
      expect(products.length).toBe(2);
    });
  });

  it('should handle network errors gracefully', () => {
    const errorResponse = new ErrorEvent('Network error');
    httpClientSpy.get.and.returnValue(throwError(errorResponse));

    service.getProducts().subscribe(
      () => fail('expected an error, not products'),
      error => expect(error).toBe(errorResponse)
    );
  });

  it('should add a valid product successfully', () => {
    const newProduct: Product = {
      id: '1',
      name: 'Test Product',
      description: 'A product for testing',
      logo: 'test-logo.png',
      date_release: new Date(),
      date_revision: new Date()
    };
    
    httpClientSpy.post.and.returnValue(of(newProduct));

    service.addProduct(newProduct).subscribe(response => {
      expect(response).toEqual(newProduct);
    });
    
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });

  it('should update the product when given a valid id and product data', () => {
    const mockProduct: Product = {
      id: '123',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: new Date(),
      date_revision: new Date()
    };
    const updatedProduct = { ...mockProduct, name: 'Updated Product' };
    
    httpClientSpy.put.and.returnValue(of(updatedProduct));

    service.updateProduct('123', updatedProduct).subscribe(result => {
      expect(result).toEqual(updatedProduct);
    });
    
    expect(httpClientSpy.put.calls.count()).toBe(1);
  });

  it('should delete the product when a valid ID is provided', () => {
    const validId = '123';
    httpClientSpy.delete.and.returnValue(of(void 0));

    service.deleteProduct(validId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    expect(httpClientSpy.delete.calls.count()).toBe(1);
  });

  it('should handle the case where the provided ID does not exist', () => {
    const invalidId = '999';
    httpClientSpy.delete.and.returnValue(throwError({ status: 404 }));

    service.deleteProduct(invalidId).subscribe(
      () => fail('expected an error, not a successful response'),
      error => {
        expect(error.status).toBe(404);
      }
    );
  });

  it('should return true when the product ID is valid', () => {
    httpClientSpy.get.and.returnValue(of(true));

    service.verifyProductId('valid-id').subscribe(response => {
      expect(response).toBeTrue();
    });
  });

  it('should return false when the product ID does not exist', () => {
    httpClientSpy.get.and.returnValue(of(false));

    service.verifyProductId('invalid-id').subscribe(response => {
      expect(response).toBeFalse();
    });
  });

  it('should handle errors when verifying product ID', () => {
    httpClientSpy.get.and.returnValue(throwError({ status: 500 }));

    service.verifyProductId('error-id').subscribe(
      () => fail('expected an error, not a response'),
      error => {
        expect(error.status).toBe(500);
      }
    );
  });
});
