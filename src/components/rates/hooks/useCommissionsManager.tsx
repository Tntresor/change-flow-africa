
import { useState } from "react";
import { CommissionTierSettings } from "@/types/rates";
import { mockCommissions } from "@/data/ratesData";

export function useCommissionsManager() {
  const [commissions, setCommissions] = useState<CommissionTierSettings[]>(mockCommissions);
  const [editingCommissionId, setEditingCommissionId] = useState<string | null>(null);
  const [editCommissionForm, setEditCommissionForm] = useState<Partial<CommissionTierSettings>>({});

  const handleEditCommission = (commission: CommissionTierSettings) => {
    setEditingCommissionId(commission.id);
    setEditCommissionForm(commission);
  };

  const handleSaveCommission = () => {
    if (editingCommissionId && editCommissionForm) {
      setCommissions(commissions.map(commission => 
        commission.id === editingCommissionId 
          ? { ...commission, ...editCommissionForm }
          : commission
      ));
      setEditingCommissionId(null);
      setEditCommissionForm({});
    }
  };

  const handleCancelCommissionEdit = () => {
    setEditingCommissionId(null);
    setEditCommissionForm({});
  };

  const toggleCommissionActive = (id: string) => {
    setCommissions(commissions.map(commission => 
      commission.id === id ? { ...commission, isActive: !commission.isActive } : commission
    ));
  };

  return {
    commissions,
    editingCommissionId,
    editCommissionForm,
    setEditCommissionForm,
    handleEditCommission,
    handleSaveCommission,
    handleCancelCommissionEdit,
    toggleCommissionActive,
  };
}
