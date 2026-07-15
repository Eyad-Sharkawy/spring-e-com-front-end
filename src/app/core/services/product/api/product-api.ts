import { inject, Service } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { ENVIRONMENT } from "../../../tokens/environment.token";
import { ProductModel } from "../../../models/ProductModel";

import { Observable } from "rxjs";

@Service()
export class ProductApi {
  private readonly httpClient = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);

  private readonly baseUrl = `${this.env.apiUrl}/products`;

  fetchAllProducts(): Observable<ProductModel[]> {
    return this.httpClient.get<ProductModel[]>(this.baseUrl);
  }

  fetchProductById(id: string): Observable<ProductModel> {
    return this.httpClient.get<ProductModel>(`${this.baseUrl}/${id}`);
  }

  createProduct(product: Omit<ProductModel, "id">): Observable<ProductModel> {
    return this.httpClient.post<ProductModel>(this.baseUrl, product);
  }

  updateProduct(id: string, product: Omit<ProductModel, "id">): Observable<ProductModel> {
    return this.httpClient.put<ProductModel>(`${this.baseUrl}/${id}`, product);
  }

  removeProduct(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
