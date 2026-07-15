import { inject, Service } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { ENVIRONMENT } from "../../../tokens/environment.token";
import { ProductModel } from "../../../models/ProductModel";

import { Observable } from "rxjs";

@Service()
export class ProductApi {
  private readonly httpClient = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);

  private readonly baseUrl = `${this.env.apiUrl}/products`;

  fetchAllProducts(sortBy: string = "name", direction: string = "asc"): Observable<ProductModel[]> {
    const params = new HttpParams().set("sortBy", sortBy).set("direction", direction);
    return this.httpClient.get<ProductModel[]>(this.baseUrl, { params });
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
