
import { CommissionTierSettings } from "@/types/rates";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, Save, X, Trash2 } from "lucide-react";
import { CommissionTierForm } from "./CommissionTierForm";
import { CommissionTierDetails } from "./CommissionTierDetails";

interface CommissionTierItemProps {
  tier: CommissionTierSettings;
  editingId: string | null;
  editForm: Partial<CommissionTierSettings>;
  setEditForm: (form: Partial<CommissionTierSettings>) => void;
  onEdit: (tier: CommissionTierSettings) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

const commissionTypes = [
  { value: "percentage", label: "Pourcentage" },
  { value: "fixed", label: "Montant fixe" },
  { value: "percentage_plus_fixed", label: "Pourcentage + montant fixe" },
  { value: "percentage_with_minimum", label: "Pourcentage avec minimum fixe" }
];

export function CommissionTierItem({
  tier,
  editingId,
  editForm,
  setEditForm,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggleActive,
}: CommissionTierItemProps) {
  const isEditing = editingId === tier.id;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono">
            {tier.name}
          </Badge>
          <Badge variant={tier.type === 'percentage' ? 'default' : 'secondary'}>
            {commissionTypes.find(t => t.value === tier.type)?.label}
          </Badge>
          <Switch
            checked={tier.isActive}
            onCheckedChange={() => onToggleActive(tier.id)}
          />
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={onSave}>
                <Save className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={() => onEdit(tier)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(tier.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      {isEditing ? (
        <CommissionTierForm editForm={editForm} onFormChange={setEditForm} />
      ) : (
        <CommissionTierDetails tier={tier} />
      )}
    </div>
  );
}
