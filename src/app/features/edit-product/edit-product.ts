import { Component, effect, inject, input } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ProductFacade } from "../../core/services/product/facade/product-facade";
import { LoadingSpinner } from "../../shared/components/loading-spinner/loading-spinner";
import { Error } from "../../shared/components/error/error";
import { AddProductForm } from "../add-product/components/add-product-form/add-product-form";
import { ProductModel } from "../../core/models/ProductModel";

@Component({
  selector: "ec-edit-product",
  imports: [RouterLink, LoadingSpinner, Error, AddProductForm],
  templateUrl: "./edit-product.html",
  styleUrl: "./edit-product.css",
})
export class EditProduct {
  private readonly productFacade = inject(ProductFacade);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  readonly product = this.productFacade.selectedProduct;
  readonly isLoading = this.productFacade.isLoading;
  readonly error = this.productFacade.error;

  constructor() {
    effect(() => {
      this.productFacade.loadProductById(this.id());
    });
  }

  handleProductSubmission(product: ProductModel) {
    this.productFacade.updateProduct(this.id(), product).subscribe({
      next: (updatedProduct) => {
        void this.router.navigate(["/product", updatedProduct.id]);
      },
      error: () => {},
    });
  }
}
