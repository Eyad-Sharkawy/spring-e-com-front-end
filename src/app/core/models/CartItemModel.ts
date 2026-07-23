export interface CartItemModel {
  productId: string;
  productName: string;
  productSeller: string;
  productPrice: number;
  productImageUrl?: string;
  quantity: number;
  availableStock: number;
  subTotal: number;
  createdAt: string;
}
