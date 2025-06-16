
import { useState, useCallback } from "react";
import { ExchangeRateSettings } from "@/types/rates";
import { mockExchangeRates } from "@/data/ratesData";
import { useToast } from "@/hooks/use-toast";

export function useExchangeRates() {
  const { toast } = useToast();
  const [rates, setRates] = useState<ExchangeRateSettings[]>(mockExchangeRates);
  const [loading, setLoading] = useState(false);

  const updateRate = useCallback((updatedRate: ExchangeRateSettings) => {
    setRates(prevRates => 
      prevRates.map(rate => 
        rate.id === updatedRate.id ? updatedRate : rate
      )
    );
  }, []);

  const toggleRateStatus = useCallback((id: string) => {
    setRates(prevRates => 
      prevRates.map(rate => 
        rate.id === id ? { ...rate, isActive: !rate.isActive } : rate
      )
    );
  }, []);

  const getActiveRates = useCallback(() => {
    return rates.filter(rate => rate.isActive);
  }, [rates]);

  const getRateByPair = useCallback((fromCurrency: string, toCurrency: string) => {
    return rates.find(rate => 
      rate.fromCurrency === fromCurrency && 
      rate.toCurrency === toCurrency && 
      rate.isActive
    );
  }, [rates]);

  const saveRates = useCallback(async () => {
    setLoading(true);
    try {
      // Simulation d'une sauvegarde API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Taux sauvegardés",
        description: "Les taux de change ont été mis à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les taux",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    rates,
    loading,
    updateRate,
    toggleRateStatus,
    getActiveRates,
    getRateByPair,
    saveRates
  };
}
