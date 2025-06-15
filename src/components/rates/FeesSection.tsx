
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { FeeSettings } from "@/types/rates";
import { FeeItem } from "./FeeItem";

interface FeesSectionProps {
  fees: FeeSettings[];
  editingFeeId: string | null;
  editFeeForm: Partial<FeeSettings>;
  onEdit: (fee: FeeSettings) => void;
  onSave: () => void;
  onCancel: () => void;
  onToggleActive: (id: string) => void;
  onFormChange: (form: Partial<FeeSettings>) => void;
}

export function FeesSection({
  fees,
  editingFeeId,
  editFeeForm,
  onEdit,
  onSave,
  onCancel,
  onToggleActive,
  onFormChange,
}: FeesSectionProps) {
  return (
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
              onEdit={onEdit}
              onSave={onSave}
              onCancel={onCancel}
              onToggleActive={onToggleActive}
              onFormChange={onFormChange}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
