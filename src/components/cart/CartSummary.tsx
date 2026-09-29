import React from 'react';
import { formatCurrency } from '@/lib/utils/currency';
import { CurrencyBadge } from './CurrencyBadge';

interface CartSummaryProps {
  subtotal: number;
  currency: string;
}

export function CartSummary({ subtotal, currency }: CartSummaryProps) {
  const estimatedTax = subtotal * 0.19; // 19% standard VAT
  const total = subtotal + estimatedTax;

  return (
    <div className="pt-4 border-t space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal, currency)}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Estimated Tax (19%)</span>
        <span>{formatCurrency(estimatedTax, currency)}</span>
      </div>
      <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
        <div className="flex items-center space-x-2">
          <span>Total</span>
          <CurrencyBadge currency={currency} />
        </div>
        <span data-testid="cart-total">{formatCurrency(total, currency)}</span>
      </div>
    </div>
  );
}
