import { Component, computed, effect, inject, input, linkedSignal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ProductFacade } from "../../core/services/product/facade/product-facade";
import { LoadingSpinner } from "../../shared/components/loading-spinner/loading-spinner";
import { Error } from "../../shared/components/error/error";
import { CurrencyPipe } from "@angular/common";
import { Title } from "@angular/platform-browser";
import { CART_ID, CartFacade } from "../../core/services/cart/facade/cart-facade";
import { CartItemModel } from "../../core/models/CartItemModel";

@Component({
  selector: "ec-product",
  imports: [RouterLink, LoadingSpinner, Error, CurrencyPipe],
  templateUrl: "./product.html",
  styleUrl: "./product.css",
})
export class Product {
  private readonly productFacade = inject(ProductFacade);
  private readonly cartFacade = inject(CartFacade);
  private readonly titleService = inject(Title);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  readonly product = this.productFacade.selectedProduct;
  readonly isLoading = this.productFacade.isLoading;
  readonly error = this.productFacade.error;

  quantity = linkedSignal({
    source: this.id,
    computation: () => 1,
  });

  isInStock = computed(() => (this.product()?.stock ?? 0) !== 0);
  subTotal = computed(() => {
    const currentProduct = this.product();

    if (currentProduct) {
      return currentProduct.price * this.quantity();
    }
    return 0;
  });

  constructor() {
    effect(() => {
      this.productFacade.loadProductById(this.id());
    });

    effect(() => {
      const currentProduct = this.product();
      if (currentProduct) {
        const currentTitle = `${currentProduct.name} | Spring E-com`;

        this.titleService.setTitle(currentTitle);
      }
    });
  }

  incrementQuantity() {
    const product = this.product();
    if (product) {
      this.quantity.update((currentQuantity) => Math.min(product.stock, currentQuantity + 1));
    }
  }

  decrementQuantity() {
    this.quantity.update((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  addToCart() {
    const item: Pick<CartItemModel, "productId" | "quantity"> = {
      productId: this.id(),
      quantity: this.quantity(),
    };
    this.cartFacade.addItemToCart(CART_ID, item).subscribe();

    void this.router.navigate(["/cart"]);
  }
}
