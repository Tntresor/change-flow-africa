
import { useState } from "react";
import { CommissionTierSettings, FeeSettings } from "@/types/rates";
import { mockCommissions, mockFees } from "@/data/ratesData";

export function useCommissionsManager() {
  const [commissions, setCommissions] = useState<CommissionTierSettings[]>(mockCommissions);
  const [fees, setFees] = useState<FeeSettings[]>(mockFees);
  const [editingCommissionId, setEditingCommissionId] = useState<string | null>(null);
  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  const [editCommissionForm, setEditCommissionForm] = useState<Partial<CommissionTierSettings>>({});
  const [editFeeForm, setEditFeeForm] = useState<Partial<FeeSettings>>({});

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

  const handleEditFee = (fee: FeeSettings) => {
    setEditingFeeId(fee.id);
    setEditFeeForm(fee);
  };

  const handleSaveFee = () => {
    if (editingFeeId && editFeeForm) {
      setFees(fees.map(fee => 
        fee.id === editingFeeId 
          ? { ...fee, ...editFeeForm }
          : fee
      ));
      setEditingFeeId(null);
      setEditFeeForm({});
    }
  };

  const handleCancelFeeEdit = () => {
    setEditingFeeId(null);
    setEditFeeForm({});
  };

  const toggleCommissionActive = (id: string) => {
    setCommissions(commissions.map(commission => 
      commission.id === id ? { ...commission, isActive: !commission.isActive } : commission
    ));
  };

  const toggleFeeActive = (id: string) => {
    setFees(fees.map(fee => 
      fee.id === id ? { ...fee, isActive: !fee.isActive } : fee
    ));
  };

  return {
    commissions,
    fees,
    editingCommissionId,
    editingFeeId,
    editCommissionForm,
    setEditCommissionForm,
    editFeeForm,
    setEditFeeForm,
    handleEditCommission,
    handleSaveCommission,
    handleCancelCommissionEdit,
    handleEditFee,
    handleSaveFee,
    handleCancelFeeEdit,
    toggleCommissionActive,
    toggleFeeActive,
  };
}
