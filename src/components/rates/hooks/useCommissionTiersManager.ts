
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CommissionTierSettings } from "@/types/rates";
import { mockCommissionTiers } from "@/data/ratesData";

export function useCommissionTiersManager(selectedTransactionType: string) {
  const { toast } = useToast();
  const [tiers, setTiers] = useState<CommissionTierSettings[]>(mockCommissionTiers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CommissionTierSettings>>({});

  const handleEdit = (tier: CommissionTierSettings) => {
    setEditingId(tier.id);
    setEditForm(tier);
  };

  const handleSave = () => {
    if (!editingId || !editForm) return;

    const originalTier = tiers.find(t => t.id === editingId)!;
    
    let updatedTiers = tiers.map(tier =>
      tier.id === editingId ? { ...tier, ...editForm } : tier
    );

    const editedTier = updatedTiers.find(t => t.id === editingId)!;

    if (editedTier.maxAmount !== undefined && editedTier.minAmount >= editedTier.maxAmount) {
      toast({
        title: "Erreur de validation",
        description: "Le montant minimum doit être inférieur au montant maximum.",
        variant: "destructive",
      });
      return;
    }

    const sortedTiersForValidation = [...updatedTiers].sort((a, b) => a.minAmount - b.minAmount);
    const validationIndex = sortedTiersForValidation.findIndex(t => t.id === editingId);

    if (validationIndex > 0) {
      const prevTier = sortedTiersForValidation[validationIndex - 1];
      if (prevTier.maxAmount !== undefined && editedTier.minAmount < prevTier.maxAmount) {
        toast({
          title: "Chevauchement de paliers",
          description: `Le montant minimum se chevauche avec le palier précédent "${prevTier.name}".`,
          variant: "destructive",
        });
        return;
      }
    }

    const maxAmountChanged = editedTier.maxAmount !== undefined && editedTier.maxAmount !== originalTier.maxAmount;

    if (maxAmountChanged) {
      updatedTiers.sort((a, b) => a.minAmount - b.minAmount);
      const tierIndex = updatedTiers.findIndex(t => t.id === editingId);
      
      let lastMaxAmount = editedTier.maxAmount!;
      
      for (let i = tierIndex + 1; i < updatedTiers.length; i++) {
        const currentTier = updatedTiers[i];
        const interval = (currentTier.maxAmount !== undefined && currentTier.maxAmount !== null)
          ? currentTier.maxAmount - currentTier.minAmount
          : undefined;

        const newMinAmount = lastMaxAmount;
        let newMaxAmount: number | undefined = undefined;

        if (interval !== undefined) {
          newMaxAmount = newMinAmount + interval;
        }

        updatedTiers[i] = {
          ...currentTier,
          minAmount: newMinAmount,
          maxAmount: newMaxAmount,
        };

        if (newMaxAmount === undefined) {
          break;
        }
        lastMaxAmount = newMaxAmount;
      }
    }

    setTiers(updatedTiers);
    setEditingId(null);
    setEditForm({});
    toast({
      title: "Paliers mis à jour",
      description: "Les modifications ont été sauvegardées et les paliers suivants ajustés si nécessaire.",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const addNewTier = () => {
    const sortedTiers = [...tiers].sort((a, b) => a.minAmount - b.minAmount);
    const lastTier = sortedTiers.length > 0 ? sortedTiers[sortedTiers.length - 1] : null;

    let newMinAmount = 0;
    if (lastTier) {
      if (lastTier.maxAmount !== undefined && lastTier.maxAmount !== null) {
        newMinAmount = lastTier.maxAmount;
      } else {
        toast({
          title: "Action impossible",
          description: "Veuillez d'abord définir une borne maximale pour le dernier palier avant d'en ajouter un nouveau.",
          variant: "destructive"
        });
        return;
      }
    }

    const newTierData: CommissionTierSettings = {
      id: `tier_${Date.now()}`,
      name: `Nouveau palier ${tiers.length + 1}`,
      minAmount: newMinAmount,
      maxAmount: newMinAmount + 500,
      fixedAmount: 0,
      percentage: 0,
      currency: "EUR",
      isActive: true,
      order: (lastTier?.order ?? 0) + 1,
      type: 'percentage',
      value: 0,
      transactionType: selectedTransactionType === "all" ? undefined : selectedTransactionType
    };

    setTiers([...tiers, newTierData]);
    setEditingId(newTierData.id);
    setEditForm(newTierData);
    toast({
      title: "Nouveau palier ajouté",
      description: "Vous pouvez maintenant le configurer.",
    });
  };

  const deleteTier = (id: string) => {
    setTiers(tiers.filter(tier => tier.id !== id));
    toast({
      title: "Palier supprimé",
      description: "Le palier a été supprimé avec succès",
    });
  };

  const toggleActive = (id: string) => {
    setTiers(tiers.map(tier => 
      tier.id === id ? { ...tier, isActive: !tier.isActive } : tier
    ));
  };
  
  const filteredTiers = selectedTransactionType === "all" 
    ? tiers 
    : tiers.filter(tier => !tier.transactionType || tier.transactionType === selectedTransactionType);

  return {
    tiers: filteredTiers,
    editingId,
    editForm,
    setEditForm,
    handleEdit,
    handleSave,
    handleCancel,
    addNewTier,
    deleteTier,
    toggleActive,
    filteredTiers,
  };
}
