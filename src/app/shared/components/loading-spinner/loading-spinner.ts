import { Component, input } from "@angular/core";

@Component({
  selector: "ec-loading-spinner",
  imports: [],
  templateUrl: "./loading-spinner.html",
  styleUrl: "./loading-spinner.css",
})
export class LoadingSpinner {
  readonly isLoading = input.required<boolean>();
}
