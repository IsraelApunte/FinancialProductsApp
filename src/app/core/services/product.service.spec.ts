import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'put', 'delete'])
    service = new ProductService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Returns an observable of Product array when the HTTP request is successful
  it('should return an observable of Product array when the HTTP request is successful', function () {
    // Arrange
    const mockProducts: Product[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() },
      { id: '2', name: 'Product 2', description: 'Description 2', logo: 'logo2.png', date_release: new Date(), date_revision: new Date() }
    ];
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    const productService = new ProductService(httpClientSpy);

    httpClientSpy.get.and.returnValue(of(mockProducts));

    // Act
    const result = productService.getProducts();

    // Assert
    result.subscribe(products => {
      expect(products).toEqual(mockProducts);
    });
  });

  // Handles network errors gracefully
  it('should handle network errors gracefully', function () {
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    const productService = new ProductService(httpClientSpy);
    const errorResponse = new ErrorEvent('Network error');

    httpClientSpy.get.and.returnValue(throwError(errorResponse));

    productService.getProducts().subscribe(
      () => fail('expected an error, not products'),
      error => expect(error).toBe(errorResponse)
    );
  });

});
