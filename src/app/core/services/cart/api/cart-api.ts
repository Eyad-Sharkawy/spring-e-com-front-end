import { inject, Service } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { ENVIRONMENT } from '../../../tokens/environment.token';
import { CartModel } from '../../../models/CartModel';
import { Observable } from 'rxjs';
import { CartItemModel } from "../../../models/CartItemModel";

@Service()
export class CartApi {
  private readonly httpClient = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);

  private readonly baseUrl = `${this.env.apiUrl}/carts`;

  fetchItemsByCartId(
    cartId: string,
    sortBy: string = "createdAt",
    direction: string = "asc",
  ): Observable<CartModel> {
    const params = new HttpParams().set("sortBy", sortBy).set("direction", direction);
    return this.httpClient.get<CartModel>(`${this.baseUrl}/${cartId}`, { params });
  }

  addItemToCart(cartId: string, item: Pick<CartItemModel, "productId" | "quantity">): Observable<CartModel> {
    return this.httpClient.post<CartModel>(`${this.baseUrl}/${cartId}/items`, item);
  }

  updateCartItemQuantity(cartId: string, productId: string, quantity: number): Observable<CartModel> {
    const params = new HttpParams().set("quantity", quantity.toString());

    return this.httpClient.put<CartModel>(`${this.baseUrl}/${cartId}/items/${productId}`, null, { params });
  }

  removeCartItem(cartId: string, productId: string): Observable<CartModel> {
    return this.httpClient.delete<CartModel>(`${this.baseUrl}/${cartId}/items/${productId}`);
  }
}
