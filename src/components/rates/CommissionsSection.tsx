
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Percent } from "lucide-react";
import { CommissionTierSettings } from "@/types/rates";
import { CommissionItem } from "./CommissionItem";

interface CommissionsSectionProps {
  commissions: CommissionTierSettings[];
  editingCommissionId: string | null;
  editCommissionForm: Partial<CommissionTierSettings>;
  onEdit: (commission: CommissionTierSettings) => void;
  onSave: () => void;
  onCancel: () => void;
  onToggleActive: (id: string) => void;
  onFormChange: (form: Partial<CommissionTierSettings>) => void;
}

export function CommissionsSection({
  commissions,
  editingCommissionId,
  editCommissionForm,
  onEdit,
  onSave,
  onCancel,
  onToggleActive,
  onFormChange,
}: CommissionsSectionProps) {
  return (
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
