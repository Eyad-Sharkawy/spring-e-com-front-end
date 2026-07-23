import { Component, inject, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CartItem } from "./components/cart-item/cart-item";
import { CART_ID, CartFacade } from "../../core/services/cart/facade/cart-facade";
import { CurrencyPipe } from "@angular/common";
import { LoadingSpinner } from "../../shared/components/loading-spinner/loading-spinner";
import { Error } from "../../shared/components/error/error";
import { CheckoutFacade } from "../../core/services/checkout/facade/checkout-facade";

export interface CartSortOption {
  value: string;
  label: string;
  sortBy: "productName" | "productPrice" | "quantity" | "subTotal" | "createdAt";
  direction: "asc" | "desc";
}

export const CART_SORT_OPTIONS: CartSortOption[] = [
  {
    value: "createdAt-asc",
    label: "Order added (first to last)",
    sortBy: "createdAt",
    direction: "asc",
  },
  {
    value: "createdAt-desc",
    label: "Order added (last to first)",
    sortBy: "createdAt",
    direction: "desc",
  },
  { value: "productName-asc", label: "Name (A–Z)", sortBy: "productName", direction: "asc" },
  { value: "productName-desc", label: "Name (Z–A)", sortBy: "productName", direction: "desc" },
  {
    value: "productPrice-asc",
    label: "Price (low to high)",
    sortBy: "productPrice",
    direction: "asc",
  },
  {
    value: "productPrice-desc",
    label: "Price (high to low)",
    sortBy: "productPrice",
    direction: "desc",
  },
  {
    value: "subTotal-desc",
    label: "Subtotal (high to low)",
    sortBy: "subTotal",
    direction: "desc",
  },
  { value: "subTotal-asc", label: "Subtotal (low to high)", sortBy: "subTotal", direction: "asc" },
  { value: "quantity-desc", label: "Quantity (most first)", sortBy: "quantity", direction: "desc" },
  { value: "quantity-asc", label: "Quantity (least first)", sortBy: "quantity", direction: "asc" },
];

@Component({
  selector: "ec-cart",
  imports: [RouterLink, CartItem, CurrencyPipe, LoadingSpinner, Error],
  templateUrl: "./cart.html",
  styleUrl: "./cart.css",
})
export class Cart implements OnInit {
  readonly sortOptions = CART_SORT_OPTIONS;
  private readonly cartFacade = inject(CartFacade);
  readonly items = this.cartFacade.items;
  readonly sumTotal = this.cartFacade.sumTotal;
  readonly error = this.cartFacade.error;
  readonly isLoading = this.cartFacade.isLoading;
  private readonly checkoutFacade = inject(CheckoutFacade);
  readonly isCheckingOut = this.checkoutFacade.isLoading;
  readonly checkoutError = this.checkoutFacade.error;
  private readonly router = inject(Router);

  ngOnInit() {
    this.cartFacade.loadCart();
  }

  onQuantityChange(productId: string, quantity: number) {
    this.cartFacade.updateCartItemQuantity(CART_ID, productId, quantity).subscribe();
  }

  onItemRemoval(productId: string) {
    this.cartFacade.removeCartItem(CART_ID, productId).subscribe();
  }

  onSortChange(value: string) {
    const selected = this.sortOptions.find((option) => option.value === value);
    if (selected) {
      this.cartFacade.loadCart(CART_ID, selected.sortBy, selected.direction);
    }
  }

  onCheckout() {
    this.checkoutFacade.checkout(CART_ID).subscribe({
      next: (order) => {
        void this.router.navigate(["/order-confirmation", order.id]);
      },
      error: () => {},
    });
  }
}
