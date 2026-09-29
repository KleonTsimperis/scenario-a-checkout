import { CartResponse, CartItem } from '@/types/cart';

let currentServerCart: CartItem[] = [
  { id: 'item-1', name: 'Mechanical Keyboard', price: 120, quantity: 1 },
  { id: 'item-2', name: 'Ergonomic Mouse', price: 80, quantity: 1 },
];

export const cartClient = {
  async getCart(): Promise<CartResponse> {
    await new Promise((res) => setTimeout(res, 200));
    const subtotal = currentServerCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      items: [...currentServerCart],
      subtotal,
      currency: 'EUR',
      updatedAt: Date.now(),
    };
  },

  async updateItem(itemId: string, delta: number, delayMs: number = 300): Promise<CartResponse> {
    await new Promise((res) => setTimeout(res, delayMs));

    currentServerCart = currentServerCart.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    );

    const subtotal = currentServerCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      items: [...currentServerCart],
      subtotal,
      currency: 'EUR',
      updatedAt: Date.now(),
    };
  },

  // Helper for test reset
  _reset(items: CartItem[]) {
    currentServerCart = [...items];
  },
};
