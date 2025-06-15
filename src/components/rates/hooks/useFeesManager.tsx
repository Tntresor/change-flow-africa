
import { useState } from "react";
import { FeeSettings } from "@/types/rates";
import { mockFees } from "@/data/ratesData";

export function useFeesManager() {
  const [fees, setFees] = useState<FeeSettings[]>(mockFees);
  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  const [editFeeForm, setEditFeeForm] = useState<Partial<FeeSettings>>({});

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

  const toggleFeeActive = (id: string) => {
    setFees(fees.map(fee => 
      fee.id === id ? { ...fee, isActive: !fee.isActive } : fee
    ));
  };

  return {
    fees,
    editingFeeId,
    editFeeForm,
    setEditFeeForm,
    handleEditFee,
    handleSaveFee,
    handleCancelFeeEdit,
    toggleFeeActive,
  };
}
