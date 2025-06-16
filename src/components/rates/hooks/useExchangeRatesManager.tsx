
import { useState } from "react";
import { ExchangeRateSettings } from "@/types/rates";
import { mockExchangeRates } from "@/data/ratesData";
import { useToast } from "@/hooks/use-toast";

export function useExchangeRatesManager() {
  const { toast } = useToast();
  const [rates, setRates] = useState<ExchangeRateSettings[]>(mockExchangeRates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ExchangeRateSettings>>({});

  const calculateBidAskFromInputs = (baseRate: number, totalSpread: number) => {
    const halfSpread = totalSpread / 2;
    return {
      bidRate: baseRate - halfSpread,
      askRate: baseRate + halfSpread
    };
  };

  const handleEdit = (rate: ExchangeRateSettings) => {
    setEditingId(rate.id);
    setEditForm(rate);
  };

  const handleSave = () => {
    if (editingId && editForm && editForm.baseRate && editForm.totalSpread) {
      const { bidRate, askRate } = calculateBidAskFromInputs(editForm.baseRate, editForm.totalSpread);
      
      setRates(rates.map(rate => 
        rate.id === editingId 
          ? { 
              ...rate, 
              ...editForm, 
              bidRate,
              askRate,
              lastUpdated: new Date() 
            }
          : rate
      ));
      setEditingId(null);
      setEditForm({});
      toast({
        title: "Taux mis à jour",
        description: "Le taux de change a été sauvegardé avec le nouveau modèle Bid/Ask",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const toggleActive = (id: string) => {
    setRates(rates.map(rate => 
      rate.id === id ? { ...rate, isActive: !rate.isActive } : rate
    ));
  };

  return {
    rates,
    editingId,
    editForm,
    setEditForm,
    handleEdit,
    handleSave,
    handleCancel,
    toggleActive,
    calculateBidAskFromInputs
  };
}
