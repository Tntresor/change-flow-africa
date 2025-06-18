
// Utilitaire global pour gérer les devises par défaut et le formatage des nombres

export const getCurrencySettings = () => {
  const primary = localStorage.getItem("exchangehub-primary-currency") || "XOF";
  const secondary = localStorage.getItem("exchangehub-secondary-currency") || "MAD";
  return { primary, secondary };
};

export const setCurrencySettings = (primary: string, secondary: string) => {
  localStorage.setItem("exchangehub-primary-currency", primary);
  localStorage.setItem("exchangehub-secondary-currency", secondary);
  
  // Déclencher un événement global pour notifier les composants
  window.dispatchEvent(new CustomEvent('currencySettingsChanged', {
    detail: { primary, secondary }
  }));
};

export const formatCurrency = (amount: number, currency: string): string => {
  // Utiliser le formatAmount existant mais avec une logique améliorée
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' ' + currency;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Hook personnalisé pour écouter les changements de devise
export const useCurrencySettings = (callback?: (settings: { primary: string, secondary: string }) => void) => {
  const [settings, setSettings] = React.useState(getCurrencySettings);
  
  React.useEffect(() => {
    const handleCurrencyChange = (event: CustomEvent) => {
      const newSettings = event.detail;
      setSettings(newSettings);
      if (callback) {
        callback(newSettings);
      }
    };
    
    window.addEventListener('currencySettingsChanged' as any, handleCurrencyChange);
    return () => {
      window.removeEventListener('currencySettingsChanged' as any, handleCurrencyChange);
    };
  }, [callback]);
  
  return settings;
};
