import { inject, Service, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { ProductApi } from "../api/product-api";
import { ProductModel } from "../../../models/ProductModel";

@Service()
export class ProductFacade {
  private readonly api = inject(ProductApi);

  private readonly _products = signal<ProductModel[]>([]);
  private readonly _selectedProduct = signal<ProductModel | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly products = this._products.asReadonly();
  readonly selectedProduct = this._selectedProduct.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  private setApiCallState(): void {
    this._isLoading.set(true);
    this._error.set(null);
  }

  loadAllProduct(): void {
    if (this._isLoading()) return;

    this.setApiCallState();

    this.runApiCall(this.api.fetchAllProducts(), 'Failed to load products', (products) => {
      this._products.set(products);
    }).subscribe();
  }

  loadProductById(productId: string): void {
    this.setApiCallState();

    this.runApiCall(this.api.fetchProductById(productId), 'Failed to load the product', (product) => {
      this._selectedProduct.set(product);
    }).subscribe();
  }

  createProduct(product: ProductModel): Observable<ProductModel> {
    this.setApiCallState();
    const { id, ...safePayLoad } = product;

    return this.runApiCall(
      this.api.createProduct(safePayLoad),
      'Failed to create product',
      (newProduct) => {
        this._products.update((products) => [...products, newProduct]);
      },
    );
  }

  updateProduct(productId: string, product: ProductModel): Observable<ProductModel> {
    this.setApiCallState();
    const { id, ...safePayLoad } = product;

    return this.runApiCall(
      this.api.updateProduct(productId, safePayLoad),
      'Failed to update product',
      (updatedProduct) => {
        this._products.update((products) =>
          products.map((p) => (p.id === productId ? updatedProduct : p)),
        );
      },
    );
  }

  removeProduct(productId: string): void {
    this.setApiCallState();
    this.runApiCall(this.api.removeProduct(productId), 'Failed to delete product', () => {
      this._products.update((products) => products.filter((p) => p.id !== productId));
    }).subscribe();
  }

  private runApiCall<T>(
    observable: Observable<T>,
    errorMessage: string,
    onSuccess: (value: T) => void,
  ): Observable<T> {
    return observable.pipe(
      tap({
        next: (value) => {
          onSuccess(value);
          this._isLoading.set(false);
        },
        error: (err) => {
          console.error(errorMessage, err);
          this._error.set(`${errorMessage}. Please try again later`);
          this._isLoading.set(false);
        },
      }),
    );
  }
}
