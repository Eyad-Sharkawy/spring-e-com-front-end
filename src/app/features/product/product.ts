import {
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  OnInit,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { ProductFacade } from "../../core/services/product/facade/product-facade";
import { LoadingSpinner } from "../../shared/components/loading-spinner/loading-spinner";
import { Error } from "../../shared/components/error/error";
import { CurrencyPipe } from "@angular/common";
import { Title } from "@angular/platform-browser";
import { CART_ID, CartFacade } from "../../core/services/cart/facade/cart-facade";
import { CartItemModel } from "../../core/models/CartItemModel";
import { ProductCard } from "../catalog/components/product-card/product-card";

const RELATED_PRODUCTS_LIMIT = 4;

@Component({
  selector: "ec-product",
  imports: [RouterLink, LoadingSpinner, Error, CurrencyPipe, ProductCard],
  templateUrl: "./product.html",
  styleUrl: "./product.css",
})
export class Product implements OnInit {
  private readonly productFacade = inject(ProductFacade);
  private readonly cartFacade = inject(CartFacade);
  private readonly titleService = inject(Title);

  readonly id = input.required<string>();

  readonly product = this.productFacade.selectedProduct;
  readonly isLoading = this.productFacade.isLoading;
  readonly error = this.productFacade.error;

  readonly cartError = this.cartFacade.error;
  readonly showAddedToast = signal(false);

  private toastTimeoutId?: ReturnType<typeof setTimeout>;

  readonly relatedProducts = computed(() => {
    const allProducts = this.productFacade.products();
    const currentId = this.id();

    const currentIndex = allProducts.findIndex((p) => p.id === currentId);
    if (currentIndex === -1 || allProducts.length <= 1) {
      return [];
    }

    const total = allProducts.length;
    const before: typeof allProducts = [];
    const after: typeof allProducts = [];

    for (let offset = 1; offset <= 2 && before.length < Math.min(2, total - 1); offset++) {
      const index = (currentIndex - offset + total) % total;
      if (index === currentIndex) break;
      before.unshift(allProducts[index]);
    }

    for (let offset = 1; offset <= 2 && after.length < Math.min(2, total - 1); offset++) {
      const index = (currentIndex + offset) % total;
      if (index === currentIndex || before.includes(allProducts[index])) break;
      after.push(allProducts[index]);
    }

    return [...before, ...after];
  });

  quantity = linkedSignal({
    source: this.id,
    computation: () => 1,
  });

  isInStock = computed(() => (this.product()?.stock ?? 0) !== 0);

  readonly quantityAlreadyInCart = computed(() => {
    const productId = this.id();
    const cartItem = this.cartFacade.items().find((item) => item.productId === productId);
    return cartItem?.quantity ?? 0;
  });

  readonly remainingAvailable = computed(() => {
    const currentProduct = this.product();
    if (!currentProduct) return 0;
    return Math.max(0, currentProduct.stock - this.quantityAlreadyInCart());
  });

  readonly hasMaxInCart = computed(() => {
    const currentProduct = this.product();
    return !!currentProduct && currentProduct.stock > 0 && this.remainingAvailable() === 0;
  });

  subTotal = computed(() => {
    const currentProduct = this.product();

    if (currentProduct) {
      return Math.round(currentProduct.price * this.quantity() * 100) / 100;
    }
    return 0;
  });

  constructor() {
    effect(() => {
      this.id();
      window.scrollTo({ top: 0, behavior: "instant" });
    });

    effect(() => {
      this.cartFacade.clearError();

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

  ngOnInit() {
    if (this.productFacade.products().length === 0) {
      this.productFacade.loadAllProduct();
    }
  }

  incrementQuantity() {
    this.quantity.update((currentQuantity) =>
      Math.min(this.remainingAvailable(), currentQuantity + 1),
    );
  }

  decrementQuantity() {
    this.quantity.update((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  addToCart() {
    const item: Pick<CartItemModel, "productId" | "quantity"> = {
      productId: this.id(),
      quantity: this.quantity(),
    };

    this.cartFacade.addItemToCart(CART_ID, item).subscribe({
      next: () => {
        this.showToast();
        this.quantity.set(1);
      },
      error: () => {},
    });
  }

  dismissToast() {
    this.showAddedToast.set(false);
    clearTimeout(this.toastTimeoutId);
  }

  private showToast(): void {
    clearTimeout(this.toastTimeoutId);
    this.showAddedToast.set(true);

    this.toastTimeoutId = setTimeout(() => {
      this.showAddedToast.set(false);
    }, 4000);
  }
}
