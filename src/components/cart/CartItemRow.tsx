'use client';

import React from 'react';
import { CartItem } from '@/types/cart';
import { useCartSync } from '@/hooks/useCartSync';
import { formatCurrency } from '@/lib/utils/currency';
import { Button } from '@/components/ui/Button';

interface CartItemRowProps {
  item: CartItem;
  currency: string;
}

export function CartItemRow({ item, currency }: CartItemRowProps) {
  const { syncQuantityChange, isSyncing } = useCartSync();

  return (
    <div
      data-testid={`cart-item-${item.id}`}
      className="flex items-center justify-between py-3 border-b last:border-b-0"
    >
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{item.name}</h4>
        <p className="text-sm text-gray-500">{formatCurrency(item.price, currency)} each</p>
      </div>

      <div className="flex items-center space-x-3">
        {/* Rapid Non-blocking button clicks */}
        <Button
          data-testid={`decrement-${item.id}`}
          variant="outline"
          className="w-8 h-8 p-0 flex items-center justify-center font-bold"
          onClick={() => syncQuantityChange(item.id, -1)}
        >
          -
        </Button>

        <span
          data-testid={`quantity-${item.id}`}
          className="w-8 text-center font-semibold text-gray-800"
        >
          {item.quantity}
        </span>

        <Button
          data-testid={`increment-${item.id}`}
          variant="outline"
          className="w-8 h-8 p-0 flex items-center justify-center font-bold"
          onClick={() => syncQuantityChange(item.id, 1)}
        >
          +
        </Button>
      </div>

      <div className="w-24 text-right font-medium text-gray-900">
        {formatCurrency(item.price * item.quantity, currency)}
      </div>
    </div>
  );
}
