
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Percent, DollarSign } from "lucide-react";
import { useCommissionsManager } from "./hooks/useCommissionsManager";
import { CommissionItem } from "./CommissionItem";
import { FeeItem } from "./FeeItem";

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
      {/* Commissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            Gestion des Commissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commissions.map((commission) => (
              <CommissionItem
                key={commission.id}
                commission={commission}
                isEditing={editingCommissionId === commission.id}
                editForm={editCommissionForm}
                onEdit={handleEditCommission}
                onSave={handleSaveCommission}
                onCancel={handleCancelCommissionEdit}
                onToggleActive={toggleCommissionActive}
                onFormChange={setEditCommissionForm}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Frais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Gestion des Frais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fees.map((fee) => (
              <FeeItem
                key={fee.id}
                fee={fee}
                isEditing={editingFeeId === fee.id}
                editForm={editFeeForm}
                onEdit={handleEditFee}
                onSave={handleSaveFee}
                onCancel={handleCancelFeeEdit}
                onToggleActive={toggleFeeActive}
                onFormChange={setEditFeeForm}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
