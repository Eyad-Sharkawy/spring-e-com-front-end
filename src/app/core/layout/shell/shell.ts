import { Component } from "@angular/core";
import { Header } from "../header/header";
import { RouterOutlet } from "@angular/router";
import { Footer } from "../footer/footer";

@Component({
  selector: "ec-shell",
  imports: [Header, RouterOutlet, Footer],
  templateUrl: "./shell.html",
  styleUrl: "./shell.css",
})
export class Shell {}
