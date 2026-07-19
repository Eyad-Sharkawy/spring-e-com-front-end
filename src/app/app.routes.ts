import { Routes } from "@angular/router";
import { Catalog } from "./features/catalog/catalog";
import { Cart } from "./features/cart/cart";
import { AddProduct } from "./features/add-product/add-product";
import { Product } from "./features/product/product";
import { EditProduct } from "./features/edit-product/edit-product";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "catalog",
    pathMatch: "full",
  },
  {
    path: "catalog",
    component: Catalog,
    title: "Catalog | Spring E-com",
  },
  {
    path: "cart",
    component: Cart,
    title: "Cart | Spring E-com",
  },
  {
    path: "add-product",
    component: AddProduct,
    title: "Add product | Spring E-com",
  },
  {
    path: "product/:id",
    component: Product,
  },
  {
    path: "product/:id/edit",
    component: EditProduct,
    title: "Edit product | Spring E-com",
  },
];
