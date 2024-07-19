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

  // Successfully adds a valid product
  it('should add a valid product successfully', function () {
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    const productService = new ProductService(httpClientSpy);
    const newProduct: Product = {
      id: '1',
      name: 'Test Product',
      description: 'A product for testing',
      logo: 'test-logo.png',
      date_release: new Date(),
      date_revision: new Date()
    };
    const expectedResponse = newProduct;
    httpClientSpy.post.and.returnValue(of(expectedResponse));

    productService.addProduct(newProduct).subscribe(response => {
      expect(response).toEqual(expectedResponse);
    });

    expect(httpClientSpy.post.calls.count()).toBe(1);
    expect(httpClientSpy.post.calls.mostRecent().args[0]).toBe(`${productService.baseUrl}`);
    expect(httpClientSpy.post.calls.mostRecent().args[1]).toEqual(newProduct);
  });
  // Successfully updates a product with valid id and product data
  it('should update the product when given a valid id and product data', function () {
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['put']);
    const productService = new ProductService(httpClientSpy);
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

    productService.updateProduct('123', updatedProduct).subscribe(result => {
      expect(result).toEqual(updatedProduct);
    });

    expect(httpClientSpy.put.calls.count()).toBe(1);
    expect(httpClientSpy.put.calls.first().args[0]).toBe(`${productService.baseUrl}/123`);
    expect(httpClientSpy.put.calls.first().args[1]).toEqual(updatedProduct);
  });

  // Successfully deletes a product when a valid ID is provided
  it('should delete the product when a valid ID is provided', function () {
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['delete']);
    const productService = new ProductService(httpClientSpy);
    const validId = '123';

    httpClientSpy.delete.and.returnValue(of(void 0));

    productService.deleteProduct(validId).subscribe(response => {
      expect(response).toBeUndefined();
      expect(httpClientSpy.delete).toHaveBeenCalledWith(`${productService.baseUrl}/${validId}`);
    });
  });

  // Handles the case where the provided ID does not exist
  it('should handle the case where the provided ID does not exist', function () {
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['delete']);
    const productService = new ProductService(httpClientSpy);
    const invalidId = '999';

    httpClientSpy.delete.and.returnValue(throwError({ status: 404 }));

    productService.deleteProduct(invalidId).subscribe(
      () => fail('expected an error, not a successful response'),
      error => {
        expect(error.status).toBe(404);
        expect(httpClientSpy.delete).toHaveBeenCalledWith(`${productService.baseUrl}/${invalidId}`);
      }
    );
  });

  // Returns true when the product ID is valid
  it('should return true when the product ID is valid', function () {
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    const productService = new ProductService(httpClientSpy);
    const expectedResponse = of(true);
    httpClientSpy.get.and.returnValue(expectedResponse);

    productService.verifyProductId('valid-id').subscribe(response => {
      expect(response).toBeTrue();
    });
  });

  // Handles non-existent product ID gracefully
  it('should handle non-existent product ID gracefully', function () {
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    const productService = new ProductService(httpClientSpy);
    const expectedResponse = of(false);
    httpClientSpy.get.and.returnValue(expectedResponse);

    productService.verifyProductId('non-existent-id').subscribe(response => {
      expect(response).toBeFalse();
    });
  });

});
