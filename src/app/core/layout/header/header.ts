import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CartFacade } from "../../services/cart/facade/cart-facade";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: "ec-header",
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
  templateUrl: "./header.html",
  styleUrl: "./header.css",
})
export class Header implements OnInit {
  private readonly cartFacade = inject(CartFacade);

  readonly isMobileMenuOpen = signal(false);

  itemsCount = computed(() =>
    this.cartFacade.items().reduce((sum, item) => sum + item.quantity, 0),
  );

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((isOpen) => !isOpen);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  ngOnInit() {
    this.cartFacade.loadCart();
  }
}
