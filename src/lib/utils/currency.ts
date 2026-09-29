export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  const symbolMap: Record<string, string> = {
    EUR: '€',
    USD: '$',
    GBP: '£',
  };

  const symbol = symbolMap[currency] || currency;
  return `${currency} ${symbol}${amount.toFixed(2)}`;
}
