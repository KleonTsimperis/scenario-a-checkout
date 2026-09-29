export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  subtotal: number;
  currency: string;
  updatedAt: number;
}

export interface OptimisticUpdateResult {
  rollbackId: string;
  previousItems: CartItem[];
}
