import { Component, computed, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CartFacade } from "../../services/cart/facade/cart-facade";

@Component({
  selector: "ec-header",
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./header.html",
  styleUrl: "./header.css",
})
export class Header {
  private readonly cartFacade = inject(CartFacade);

  itemsCount = computed(() =>
    this.cartFacade.items().reduce((sum, item) => sum + item.quantity, 0),
  );
}
