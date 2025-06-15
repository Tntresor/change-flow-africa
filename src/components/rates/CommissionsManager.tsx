
import { useCommissionsManager } from "./hooks/useCommissionsManager";
import { CommissionsSection } from "./CommissionsSection";

export function CommissionsManager() {
  const {
    commissions,
    editingCommissionId,
    editCommissionForm,
    setEditCommissionForm,
    handleEditCommission,
    handleSaveCommission,
    handleCancelCommissionEdit,
    toggleCommissionActive,
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
    </div>
  );
}
