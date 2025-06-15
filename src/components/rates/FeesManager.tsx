
import { useFeesManager } from "./hooks/useFeesManager";
import { FeesSection } from "./FeesSection";

export function FeesManager() {
  const {
    fees,
    editingFeeId,
    editFeeForm,
    setEditFeeForm,
    handleEditFee,
    handleSaveFee,
    handleCancelFeeEdit,
    toggleFeeActive,
  } = useFeesManager();

  return (
    <div className="space-y-6">
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
