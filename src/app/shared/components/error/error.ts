import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "ec-error",
  imports: [RouterLink],
  templateUrl: "./error.html",
  styleUrl: "./error.css",
})
export class Error {
  readonly errorMessage = input.required<string>();
  readonly isCatalog = input<boolean>(false);
}
