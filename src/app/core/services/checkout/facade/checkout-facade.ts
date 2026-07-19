import { inject, Service, signal } from "@angular/core";
import { CheckoutApi } from "../api/checkout-api";
import { CartFacade } from "../../cart/facade/cart-facade";
import { Observable, tap } from "rxjs";
import { OrderModel } from "../../../models/OrderModel";

@Service()
export class CheckoutFacade {
  private readonly api = inject(CheckoutApi);
  private readonly cartFacade = inject(CartFacade);

  private readonly _lastOrder = signal<OrderModel | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly lastOrder = this._lastOrder.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  checkout(cartId: string): Observable<OrderModel> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.api.checkout(cartId).pipe(
      tap({
        next: (order) => {
          this._lastOrder.set(order);
          this._isLoading.set(false);
          this.cartFacade.clearCart();
        },
        error: (err) => {
          console.error("Failed to check out", err);
          this._error.set("Failed to complete checkout. Please try again later");
          this._isLoading.set(false);
        },
      }),
    );
  }
}
