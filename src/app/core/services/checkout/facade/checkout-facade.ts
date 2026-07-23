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
  readonly lastOrder = this._lastOrder.asReadonly();
  private readonly _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();
  private readonly _error = signal<string | null>(null);
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
          const backendMessage = err.error?.message;
          this._error.set(backendMessage || "Failed to complete checkout. Please try again later");
          this._isLoading.set(false);
        },
      }),
    );
  }
}
