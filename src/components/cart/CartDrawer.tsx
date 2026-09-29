'use client';

import React from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useCurrencyLocale } from '@/hooks/useCurrencyLocale';
import { CartItemRow } from './CartItemRow';
import { CartSummary } from './CartSummary';

export function CartDrawer() {
  const { items } = useCartStore();
  
  // INTENTIONAL BUG 2:
  // Direct call during render body returns 'EUR' during server prerender,
  // but returns client's localStorage currency (e.g. 'USD') upon browser hydration!
  const currency = useCurrencyLocale();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div data-testid="cart-drawer" className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
        <span className="text-sm text-gray-500">{items.length} items</span>
      </div>

      <div className="divide-y divide-gray-100 my-4">
        {items.map((item) => (
          <CartItemRow key={item.id} item={item} currency={currency} />
        ))}
      </div>

      <CartSummary subtotal={subtotal} currency={currency} />
    </div>
  );
}
