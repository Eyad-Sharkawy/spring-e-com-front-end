import { OrderItemModel } from "./OrderItemModel";

export interface OrderModel {
  id: string;
  items: OrderItemModel[];
  totalAmount: number;
  createdAt: string;
}
