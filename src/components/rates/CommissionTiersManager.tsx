
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCommissionTiersManager } from "./hooks/useCommissionTiersManager";
import { CommissionTiersHeader } from "./CommissionTiersHeader";
import { CommissionTierItem } from "./CommissionTierItem";

export function CommissionTiersManager() {
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>("all");
  const {
    filteredTiers,
    editingId,
    editForm,
    setEditForm,
    handleEdit,
    handleSave,
    handleCancel,
    addNewTier,
    deleteTier,
    toggleActive,
  } = useCommissionTiersManager(selectedTransactionType);

  return (
    <Card>
      <CardHeader>
        <CommissionTiersHeader
          selectedTransactionType={selectedTransactionType}
          onTransactionTypeChange={setSelectedTransactionType}
          onAddNewTier={addNewTier}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTiers.sort((a, b) => a.minAmount - b.minAmount).map((tier) => (
            <CommissionTierItem
              key={tier.id}
              tier={tier}
              editingId={editingId}
              editForm={editForm}
              setEditForm={setEditForm}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={deleteTier}
              onToggleActive={toggleActive}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
