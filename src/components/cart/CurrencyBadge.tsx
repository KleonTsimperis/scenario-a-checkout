import React from 'react';

export function CurrencyBadge({ currency }: { currency: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800 border">
      {currency}
    </span>
  );
}
