import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public baseUrl = environment.baseUrl;
  constructor(public http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}`, product);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  verifyProductId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`);
  }
}
