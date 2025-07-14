// Currency formatting utility for Indonesian Rupiah
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'Rp 0';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return 'Rp 0';
  
  // Format with dots as thousand separators
  const formatted = numAmount.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return `Rp ${formatted}`;
};

// Parse currency string back to number
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;
  
  // Remove 'Rp' and dots, then parse
  const cleaned = currencyString.replace(/Rp\s?/g, '').replace(/\./g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
};

// Format currency for input fields (without Rp prefix)
export const formatCurrencyInput = (amount) => {
  if (!amount && amount !== 0) return '';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '';
  
  return numAmount.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};
