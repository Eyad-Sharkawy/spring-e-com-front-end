import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CartItem } from "./components/cart-item/cart-item";
import { CART_ID, CartFacade } from "../../core/services/cart/facade/cart-facade";
import { CurrencyPipe } from "@angular/common";
import { LoadingSpinner } from "../../shared/components/loading-spinner/loading-spinner";
import { Error } from "../../shared/components/error/error";

@Component({
  selector: "ec-cart",
  imports: [RouterLink, CartItem, CurrencyPipe, LoadingSpinner, Error],
  templateUrl: "./cart.html",
  styleUrl: "./cart.css",
})
export class Cart implements OnInit {
  private readonly facade = inject(CartFacade);

  readonly items = this.facade.items;
  readonly sumTotal = this.facade.sumTotal;
  readonly error = this.facade.error;
  readonly isLoading = this.facade.isLoading;

  ngOnInit() {
    this.facade.loadCart();
  }

  onQuantityChange(productId: string, quantity: number) {
    this.facade.updateCartItemQuantity(CART_ID, productId, quantity).subscribe();
  }

  onItemRemoval(productId: string) {
    this.facade.removeCartItem(CART_ID, productId).subscribe();
  }
}
