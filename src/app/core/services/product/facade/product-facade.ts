import { inject, Service, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { ProductApi } from "../api/product-api";
import { ProductModel } from "../../../models/ProductModel";
import { LOCAL_STORAGE } from "../../../tokens/storage.token";

type SortField = "name" | "price" | "stock" | "createdAt" | "updatedAt";
type SortDirection = "asc" | "desc";

@Service()
export class ProductFacade {
  private static readonly COMPARATORS: Record<
    SortField,
    (a: ProductModel, b: ProductModel) => number
  > = {
    name: (a, b) => a.name.localeCompare(b.name),
    price: (a, b) => a.price - b.price,
    stock: (a, b) => a.stock - b.stock,
    createdAt: (a, b) =>
      ProductFacade.toTimestamp(a.createdAt) - ProductFacade.toTimestamp(b.createdAt),
    updatedAt: (a, b) =>
      ProductFacade.toTimestamp(a.updatedAt) - ProductFacade.toTimestamp(b.updatedAt),
  };
  private readonly api = inject(ProductApi);
  private readonly storage = inject(LOCAL_STORAGE);
  private readonly _products = signal<ProductModel[]>([]);
  readonly products = this._products.asReadonly();
  private readonly _selectedProduct = signal<ProductModel | null>(null);
  readonly selectedProduct = this._selectedProduct.asReadonly();
  private readonly _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();
  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  private readonly _sortBy = signal<SortField>(
    (() => {
      const val = this.storage.getItem("product_sort_by") as SortField;
      return ["name", "price", "stock", "createdAt", "updatedAt"].includes(val) ? val : "updatedAt";
    })(),
  );
  readonly sortBy = this._sortBy.asReadonly();
  private readonly _direction = signal<SortDirection>(
    (() => {
      const val = this.storage.getItem("product_sort_direction") as SortDirection;
      return ["asc", "desc"].includes(val) ? val : "desc";
    })(),
  );
  readonly direction = this._direction.asReadonly();

  private static toTimestamp(value: string | undefined): number {
    return value ? new Date(value).getTime() : 0;
  }

  loadAllProduct(
    sortBy: SortField = this._sortBy(),
    direction: SortDirection = this._direction(),
  ): void {
    if (this._isLoading()) return;
    this._sortBy.set(sortBy);
    this._direction.set(direction);
    this.storage.setItem("product_sort_by", sortBy);
    this.storage.setItem("product_sort_direction", direction);
    this.setApiCallState();

    this.runApiCall(
      this.api.fetchAllProducts(sortBy, direction),
      "Failed to load products",
      (products) => {
        this._products.set(products);
      },
    ).subscribe();
  }

  loadProductById(productId: string): void {
    this.setApiCallState();
    this.runApiCall(
      this.api.fetchProductById(productId),
      "Failed to load the product",
      (product) => {
        this._selectedProduct.set(product);
      },
    ).subscribe();
  }

  createProduct(product: ProductModel): Observable<ProductModel> {
    this.setApiCallState();
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...safePayLoad } = product;

    return this.runApiCall(
      this.api.createProduct(safePayLoad),
      "Failed to create product",
      (newProduct) => {
        this._products.update((products) => this.sortInPlace([...products, newProduct]));
      },
    );
  }

  updateProduct(productId: string, product: ProductModel): Observable<ProductModel> {
    this.setApiCallState();
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...safePayLoad } = product;

    return this.runApiCall(
      this.api.updateProduct(productId, safePayLoad),
      "Failed to update product",
      (updatedProduct) => {
        this._products.update((products) =>
          this.sortInPlace(products.map((p) => (p.id === productId ? updatedProduct : p))),
        );
      },
    );
  }

  removeProduct(productId: string): void {
    this.setApiCallState();
    this.runApiCall(this.api.removeProduct(productId), "Failed to delete product", () => {
      this._products.update((products) => products.filter((p) => p.id !== productId));
    }).subscribe();
  }

  uploadProductImage(productId: string, file: File): Observable<ProductModel> {
    this.setApiCallState();
    return this.runApiCall(
      this.api.uploadProductImage(productId, file),
      "Failed to upload product image",
      (updatedProduct) => {
        this._products.update((products) =>
          this.sortInPlace(products.map((p) => (p.id === productId ? updatedProduct : p))),
        );
        if (this._selectedProduct()?.id === productId) {
          this._selectedProduct.set(updatedProduct);
        }
      },
    );
  }

  private setApiCallState(): void {
    this._isLoading.set(true);
    this._error.set(null);
  }

  private currentComparator(): (a: ProductModel, b: ProductModel) => number {
    const base = ProductFacade.COMPARATORS[this._sortBy()];
    return this._direction() === "desc" ? (a, b) => base(b, a) : base;
  }

  private sortInPlace(products: ProductModel[]): ProductModel[] {
    return [...products].sort(this.currentComparator());
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
          const backendMessage = err.error?.message;
          this._error.set(backendMessage || `${errorMessage}. Please try again later`);
          this._isLoading.set(false);
        },
      }),
    );
  }
}
