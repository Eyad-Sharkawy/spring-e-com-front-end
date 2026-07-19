import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CurrencyPipe } from "@angular/common";
import { CheckoutFacade } from "../../core/services/checkout/facade/checkout-facade";

@Component({
  selector: "ec-order-confirmation",
  imports: [RouterLink, CurrencyPipe],
  templateUrl: "./order-confirmation.html",
  styleUrl: "./order-confirmation.css",
})
export class OrderConfirmation {
  private readonly checkoutFacade = inject(CheckoutFacade);

  readonly order = this.checkoutFacade.lastOrder;
}
