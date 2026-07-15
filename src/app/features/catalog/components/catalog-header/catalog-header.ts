import { Component, input } from "@angular/core";

@Component({
  selector: "ec-catalog-header",
  imports: [],
  templateUrl: "./catalog-header.html",
  styleUrl: "./catalog-header.css",
})
export class CatalogHeader {
  readonly numberOfProducts = input.required<number>();
}
