import { inject, Service } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ENVIRONMENT } from "../../../tokens/environment.token";
import { OrderModel } from "../../../models/OrderModel";
import { Observable } from "rxjs";

@Service()
export class CheckoutApi {
  private readonly httpClient = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);

  private readonly baseUrl = `${this.env.apiUrl}/checkout`;

  checkout(cartId: string): Observable<OrderModel> {
    return this.httpClient.post<OrderModel>(`${this.baseUrl}/${cartId}`, null);
  }
}
