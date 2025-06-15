
import { useState, useEffect } from "react";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  isDefault: boolean;
}

const defaultCurrencies: Currency[] = [
  { code: "EUR", name: "Euro", symbol: "€", isDefault: true },
  { code: "USD", name: "Dollar US", symbol: "$", isDefault: true },
  { code: "XOF", name: "Franc CFA", symbol: "F CFA", isDefault: true },
  { code: "MAD", name: "Dirham Marocain", symbol: "DH", isDefault: true },
  { code: "AED", name: "Dirham des Émirats", symbol: "د.إ", isDefault: true },
  { code: "RWF", name: "Franc Rwandais", symbol: "RF", isDefault: true },
  { code: "GBP", name: "Livre Sterling", symbol: "£", isDefault: false },
  { code: "CAD", name: "Dollar Canadien", symbol: "C$", isDefault: false },
];

export function useCurrencyManager() {
  const [currencies, setCurrencies] = useState<Currency[]>(() => {
    try {
      const storedCurrencies = localStorage.getItem("exchangehub-currencies");
      return storedCurrencies ? JSON.parse(storedCurrencies) : defaultCurrencies;
    } catch (error) {
      console.error("Error loading currencies from localStorage", error);
      return defaultCurrencies;
    }
  });
  const [newCurrency, setNewCurrency] = useState({ code: "", name: "", symbol: "" });

  useEffect(() => {
    try {
      localStorage.setItem("exchangehub-currencies", JSON.stringify(currencies));
    } catch (error) {
      console.error("Error saving currencies to localStorage", error);
    }
  }, [currencies]);

  const addCurrency = () => {
    if (newCurrency.code && newCurrency.name && newCurrency.symbol) {
      const currency: Currency = {
        ...newCurrency,
        code: newCurrency.code.toUpperCase(),
        isDefault: false,
      };
      setCurrencies([...currencies, currency]);
      setNewCurrency({ code: "", name: "", symbol: "" });
    }
  };

  const removeCurrency = (code: string) => {
    setCurrencies(currencies.filter(c => c.code !== code || c.isDefault));
  };
  
  return {
    currencies,
    newCurrency,
    setNewCurrency,
    addCurrency,
    removeCurrency,
  };
}
