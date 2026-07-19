import { Component, effect, inject, input, output, signal } from "@angular/core";
import { ProductModel } from "../../../../core/models/ProductModel";
import { form, FormField, min, required } from "@angular/forms/signals";
import { FormsModule } from "@angular/forms";
import { ProductFacade } from "../../../../core/services/product/facade/product-facade";

const INITIAL_PRODUCT_STATE: ProductModel = {
  id: "",
  seller: "",
  name: "",
  description: "",
  price: null as unknown as number,
  stock: null as unknown as number,
};

@Component({
  selector: "ec-add-product-form",
  imports: [FormsModule, FormField],
  templateUrl: "./add-product-form.html",
  styleUrl: "./add-product-form.css",
})
export class AddProductForm {
  private readonly productFacade = inject(ProductFacade);

  readonly initialProduct = input<ProductModel | null>(null);
  readonly submitLabel = input<string>("Publish piece");
  readonly submittedProduct = output<ProductModel>();

  private readonly productModel = signal<ProductModel>({ ...INITIAL_PRODUCT_STATE });

  readonly productForm = form(this.productModel, (schema) => {
    required(schema.seller);
    required(schema.name);
    required(schema.description);
    required(schema.price);
    required(schema.stock);
    min(schema.price, 0, { message: "Price can't be negative" });
    min(schema.stock, 0, { message: "Stock can't be negative" });
  });

  constructor() {
    effect(() => {
      const seed = this.initialProduct();
      if (seed) {
        this.productModel.set({ ...seed });
      }
    });
  }

  onSubmit() {
    if (this.productForm().valid()) {
      const finalProduct = this.productModel();

      this.submittedProduct.emit(finalProduct);

      if (!this.initialProduct()) {
        this.productModel.set({ ...INITIAL_PRODUCT_STATE });
        this.productForm().reset();
      }
    } else {
      console.error("Form is invalid");
    }
  }
}
