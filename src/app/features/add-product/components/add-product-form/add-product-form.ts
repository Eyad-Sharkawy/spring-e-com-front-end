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
  readonly initialProduct = input<ProductModel | null>(null);
  readonly submitLabel = input<string>("Publish piece");
  readonly submittedProduct = output<{ product: ProductModel; imageFile: File | null }>();
  readonly imagePreviewUrl = signal<string | null>(null);
  readonly selectedFile = signal<File | null>(null);
  private readonly productFacade = inject(ProductFacade);
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
      // Always reset image preview and selected file first to prevent state leakage
      this.selectedFile.set(null);
      this.imagePreviewUrl.set(null);

      if (seed) {
        this.productModel.set({ ...seed });
        if (seed.imageUrl) {
          this.imagePreviewUrl.set(seed.imageUrl);
        }
      } else {
        this.productModel.set({ ...INITIAL_PRODUCT_STATE });
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  clearImage() {
    this.selectedFile.set(null);
    this.imagePreviewUrl.set(null);
  }

  onSubmit() {
    if (this.productForm().valid()) {
      const finalProduct = this.productModel();

      this.submittedProduct.emit({
        product: finalProduct,
        imageFile: this.selectedFile(),
      });

      if (!this.initialProduct()) {
        this.productModel.set({ ...INITIAL_PRODUCT_STATE });
        this.selectedFile.set(null);
        this.imagePreviewUrl.set(null);
        this.productForm().reset();
      }
    } else {
      console.error("Form is invalid");
    }
  }

  private handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      return;
    }
    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
}
