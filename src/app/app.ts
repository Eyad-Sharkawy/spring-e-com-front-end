import { Component, signal } from "@angular/core";
import { Shell } from "./core/layout/shell/shell";

@Component({
  selector: "ec-root",
  imports: [Shell],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  protected readonly title = signal("Spring e-com");
}
