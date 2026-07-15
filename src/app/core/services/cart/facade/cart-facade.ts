import { inject, Service, signal } from "@angular/core";
import { CartApi } from "../api/cart-api";
import { CartItemModel } from "../../../models/CartItemModel";
import { EMPTY, Observable, tap } from "rxjs";
import { CartModel } from "../../../models/CartModel";

export const CART_ID = "af01b535-0d4f-4995-a55e-d95a2c5c5c1a";

type CartSortField = "productName" | "productPrice" | "quantity" | "subTotal";
type SortDirection = "asc" | "desc";

@Service()
export class CartFacade {
  private readonly api = inject(CartApi);

  private readonly _items = signal<CartItemModel[]>([]);
  private readonly _sumTotal = signal<number>(0);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  private readonly _sortBy = signal<CartSortField>('productName');
  private readonly _direction = signal<SortDirection>('asc');

  readonly items = this._items.asReadonly();
  readonly sumTotal = this._sumTotal.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  private static readonly COMPARATORS: Record<CartSortField, (a: CartItemModel, b: CartItemModel) => number> = {
    productName: (a, b) => a.productName.localeCompare(b.productName),
    productPrice: (a, b) => a.productPrice - b.productPrice,
    quantity: (a, b) => a.quantity - b.quantity,
    subTotal: (a, b) => a.subTotal - b.subTotal,
  };

  private setApiCallState(): void {
    this._isLoading.set(true);
    this._error.set(null);
  }

  private currentComparator(): (a: CartItemModel, b: CartItemModel) => number {
    const base = CartFacade.COMPARATORS[this._sortBy()];
    return this._direction() === 'desc' ? (a, b) => base(b, a) : base;
  }

  private sortInPlace(items: CartItemModel[]): CartItemModel[] {
    return [...items].sort(this.currentComparator());
  }

  loadCart(
    cartId: string = CART_ID,
    sortBy: CartSortField = 'productName',
    direction: SortDirection = 'asc',
  ): void {
    if (this._isLoading()) return;
    this._sortBy.set(sortBy);
    this._direction.set(direction);
    this.setApiCallState();

    this.subscribeToApi(
      this.api.fetchItemsByCartId(cartId, sortBy, direction),
      "Failed to load the cart",
    ).subscribe();
  }

  addItemToCart(
    cartId: string = CART_ID,
    item: Pick<CartItemModel, "productId" | "quantity">,
  ): Observable<CartModel> {
    this.setApiCallState();

    const { productId, quantity } = item;
    const safePayLoad = { productId, quantity };

    return this.subscribeToApi(
      this.api.addItemToCart(cartId, safePayLoad),
      "Failed to add item to cart",
    );
  }

  updateCartItemQuantity(
    cartId: string = CART_ID,
    productId: string,
    quantity: number,
  ): Observable<CartModel> {
    const previousItems = this._items();
    const currentItem = previousItems.find((item) => item.productId === productId);

    if (!this.isValidQuantity(quantity, currentItem)) {
      return EMPTY;
    }

    this._error.set(null);
    this._items.update((items) =>
      this.sortInPlace(
        items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
      ),
    );
    this.recalculateTotal();

    return this.subscribeToApi(
      this.api.updateCartItemQuantity(cartId, productId, quantity),
      "Failed to update cart items quantity",
      previousItems,
    );
  }

  private isValidQuantity(quantity: number, currentItem: CartItemModel | undefined): boolean {
    if (quantity <= 0) {
      this._error.set("Quantity must be greater than zero");
      return false;
    }
    if (currentItem && quantity > currentItem.availableStock) {
      this._error.set(`Only ${currentItem.availableStock} left in stock`);
      return false;
    }
    return true;
  }

  private recalculateTotal(): void {
    const totalInCents = this._items().reduce(
      (sumCents, item) => sumCents + Math.round(item.productPrice * 100) * item.quantity,
      0,
    );
    this._sumTotal.set(totalInCents / 100);
  }

  removeCartItem(cartId: string = CART_ID, productId: string): Observable<CartModel> {
    const previousItems = this._items();

    this._error.set(null);
    this._items.update((items) => items.filter((item) => item.productId !== productId));
    this.recalculateTotal();

    return this.subscribeToApi(
      this.api.removeCartItem(cartId, productId),
      "Failed to remove this cart item",
      previousItems,
    );
  }

  subscribeToApi(
    observable: Observable<CartModel>,
    errorMessage: string,
    previousItems?: CartItemModel[],
  ) {
    return observable.pipe(
      tap({
        next: (newCart) => {
          this._items.set(this.sortInPlace(newCart.items));
          this._sumTotal.set(newCart.sumTotal);
          this._isLoading.set(false);
        },
        error: (err) => {
          console.error(errorMessage, err);
          this._error.set(`${errorMessage}. Please try again later`);
          this._isLoading.set(false);
          if (previousItems) {
            this._items.set(previousItems);
            this.recalculateTotal();
          }
        },
      }),
    );
  }
}
