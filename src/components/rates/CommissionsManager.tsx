
import { useCommissionsManager } from "./hooks/useCommissionsManager";
import { CommissionsSection } from "./CommissionsSection";
import { FeesSection } from "./FeesSection";

export function CommissionsManager() {
  const {
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
  } = useCommissionsManager();

  return (
    <div className="space-y-6">
      <CommissionsSection
        commissions={commissions}
        editingCommissionId={editingCommissionId}
        editCommissionForm={editCommissionForm}
        onEdit={handleEditCommission}
        onSave={handleSaveCommission}
        onCancel={handleCancelCommissionEdit}
        onToggleActive={toggleCommissionActive}
        onFormChange={setEditCommissionForm}
      />

      <FeesSection
        fees={fees}
        editingFeeId={editingFeeId}
        editFeeForm={editFeeForm}
        onEdit={handleEditFee}
        onSave={handleSaveFee}
        onCancel={handleCancelFeeEdit}
        onToggleActive={toggleFeeActive}
        onFormChange={setEditFeeForm}
      />
    </div>
  );
}
