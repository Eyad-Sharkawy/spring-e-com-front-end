import { Component, effect, inject, input, signal } from "@angular/core";
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

  handleProductSubmission(submission: { product: ProductModel; imageFile: File | null }) {
    this.productFacade.updateProduct(this.id(), submission.product).subscribe({
      next: (updatedProduct) => {
        if (submission.imageFile) {
          this.productFacade.uploadProductImage(updatedProduct.id, submission.imageFile).subscribe({
            next: () => {
              void this.router.navigate(["/product", updatedProduct.id]);
            },
            error: () => {
              void this.router.navigate(["/product", updatedProduct.id]);
            },
          });
        } else {
          void this.router.navigate(["/product", updatedProduct.id]);
        }
      },
      error: () => {},
    });
  }

  readonly showDeleteModal = signal(false);

  deleteProduct() {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
  }

  confirmDelete() {
    this.productFacade.removeProduct(this.id());
    this.showDeleteModal.set(false);
    void this.router.navigate(["/catalog"]);
  }
}
