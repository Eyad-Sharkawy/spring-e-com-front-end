import { Component, input, output } from "@angular/core";

export interface SortOption {
  value: string;
  label: string;
  sortBy: "name" | "price" | "stock" | "createdAt" | "updatedAt";
  direction: "asc" | "desc";
}

export const SORT_OPTIONS: SortOption[] = [
  { value: "updatedAt-desc", label: "Newest first", sortBy: "updatedAt", direction: "desc" },
  { value: "updatedAt-asc", label: "Oldest first", sortBy: "updatedAt", direction: "asc" },
  { value: "name-asc", label: "Name (A–Z)", sortBy: "name", direction: "asc" },
  { value: "name-desc", label: "Name (Z–A)", sortBy: "name", direction: "desc" },
  { value: "price-asc", label: "Price (low to high)", sortBy: "price", direction: "asc" },
  { value: "price-desc", label: "Price (high to low)", sortBy: "price", direction: "desc" },
  { value: "stock-desc", label: "Most in stock", sortBy: "stock", direction: "desc" },
  { value: "stock-asc", label: "Least in stock", sortBy: "stock", direction: "asc" },
];

@Component({
  selector: "ec-catalog-header",
  imports: [],
  templateUrl: "./catalog-header.html",
  styleUrl: "./catalog-header.css",
})
export class CatalogHeader {
  readonly numberOfProducts = input.required<number>();
  readonly sortChange = output<SortOption>();

  readonly sortOptions = SORT_OPTIONS;

  onSortChange(value: string) {
    const selected = this.sortOptions.find((option) => option.value === value);
    if (selected) {
      this.sortChange.emit(selected);
    }
  }
}
