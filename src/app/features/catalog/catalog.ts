import { Component, inject, OnInit } from "@angular/core";
import { ProductCard } from "./components/product-card/product-card";
import { CatalogHeader } from "./components/catalog-header/catalog-header";
import { ProductFacade } from "../../core/services/product/facade/product-facade";
import { LoadingSpinner } from "../../shared/components/loading-spinner/loading-spinner";
import { Error } from "../../shared/components/error/error";

@Component({
  selector: "ec-catalog",
  imports: [ProductCard, CatalogHeader, LoadingSpinner, Error],
  templateUrl: "./catalog.html",
  styleUrl: "./catalog.css",
})
export class Catalog implements OnInit {
  private readonly productFacade = inject(ProductFacade);
  readonly isLoading = this.productFacade.isLoading;
  readonly error = this.productFacade.error;
  readonly products = this.productFacade.products;

  ngOnInit() {
    this.productFacade.loadAllProduct();
  }
}
