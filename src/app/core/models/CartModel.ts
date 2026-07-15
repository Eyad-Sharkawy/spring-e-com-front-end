import { CartItemModel } from "./CartItemModel";

export interface CartModel {
  id: string;
  items: CartItemModel[];
  sumTotal: number;
}
