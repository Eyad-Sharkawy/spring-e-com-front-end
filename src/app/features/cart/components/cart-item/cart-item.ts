import { Component, computed, input, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CartItemModel } from "../../../../core/models/CartItemModel";
import { CurrencyPipe, NgOptimizedImage } from "@angular/common";

@Component({
  selector: "ec-cart-item",
  imports: [RouterLink, CurrencyPipe, NgOptimizedImage],
  templateUrl: "./cart-item.html",
  styleUrl: "./cart-item.css",
})
export class CartItem {
  readonly item = input.required<CartItemModel>();

  readonly quantityChange = output<number>();
  readonly removeItem = output();
  readonly itemQuantity = computed(() => this.item().quantity);
  readonly canDecreaseQuantity = computed(() => this.itemQuantity() > 1);
  readonly productId = computed(() => this.item().productId);
  private readonly availableStock = computed(() => this.item().availableStock);
  readonly canIncreaseQuantity = computed(() => this.availableStock() > this.itemQuantity());

  incrementQuantity() {
    if (this.canIncreaseQuantity()) {
      this.quantityChange.emit(this.item().quantity + 1);
    }
  }

  decrementQuantity() {
    if (this.canDecreaseQuantity()) {
      this.quantityChange.emit(this.item().quantity - 1);
    }
  }

  remove() {
    this.removeItem.emit();
  }
}
