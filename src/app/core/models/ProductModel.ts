export interface ProductModel {
  id: string;
  seller: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}
