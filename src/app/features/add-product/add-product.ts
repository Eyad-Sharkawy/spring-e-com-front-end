import { Component, inject } from "@angular/core";
import { AddProductHeader } from "./components/add-product-header/add-product-header";
import { Router, RouterLink } from "@angular/router";
import { AddProductForm } from "./components/add-product-form/add-product-form";
import { ProductFacade } from "../../core/services/product/facade/product-facade";
import { ProductModel } from "../../core/models/ProductModel";

@Component({
  selector: "ec-add-product",
  imports: [AddProductHeader, RouterLink, AddProductForm],
  templateUrl: "./add-product.html",
  styleUrl: "./add-product.css",
})
export class AddProduct {
  private readonly productFacade = inject(ProductFacade);
  private readonly router = inject(Router);

  handleProductSubmission(product: ProductModel) {
    this.productFacade.createProduct(product).subscribe({
      next: (newProduct) => {
        void this.router.navigate(["/product", newProduct.id]);
      },
      error: () => {
      },
    });
  }
}
