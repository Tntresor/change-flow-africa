
// Utilitaire global pour gérer les devises par défaut et le formatage des nombres

export const DEFAULT_CURRENCIES = {
  PRIMARY: 'XOF',
  SECONDARY: 'MAD'
} as const;

export type SupportedCurrency = 'XOF' | 'MAD' | 'EUR' | 'USD' | 'AED' | 'RWF';

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  XOF: 'CFA',
  MAD: 'MAD',
  EUR: '€',
  USD: '$',
  AED: 'AED',
  RWF: 'RWF'
};

export const formatAmount = (amount: number, currency: SupportedCurrency): string => {
  try {
    // Pour les devises qui ont des symboles spéciaux
    if (currency === 'XOF') {
      return `${amount.toLocaleString('fr-FR')} CFA`;
    }
    
    if (currency === 'MAD') {
      return `${amount.toLocaleString('fr-FR')} MAD`;
    }

    // Pour EUR et USD, utiliser le formatage standard
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('Erreur lors du formatage du montant:', error);
    return `${amount.toLocaleString()} ${currency}`;
  }
};

export const formatNumber = (value: number): string => {
  return value.toLocaleString('fr-FR');
};

export const parseCurrencyAmount = (formattedAmount: string): number => {
  const cleanAmount = formattedAmount.replace(/[^\d,.-]/g, '').replace(',', '.');
  return parseFloat(cleanAmount) || 0;
};
