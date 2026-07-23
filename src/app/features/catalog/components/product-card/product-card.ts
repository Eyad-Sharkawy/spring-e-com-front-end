import { Component, computed, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ProductModel } from "../../../../core/models/ProductModel";
import { CurrencyPipe, NgOptimizedImage } from "@angular/common";

@Component({
  selector: "ec-product-card",
  imports: [RouterLink, CurrencyPipe, NgOptimizedImage],
  templateUrl: "./product-card.html",
  styleUrl: "./product-card.css",
  host: {
    class: "card",
  },
})
export class ProductCard {
  readonly product = input.required<ProductModel>();
  isInStock = computed(() => this.product().stock !== 0);
}
