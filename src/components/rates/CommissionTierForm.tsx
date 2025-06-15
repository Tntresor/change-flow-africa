
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommissionTierSettings } from "@/types/rates";

interface CommissionTierFormProps {
  editForm: Partial<CommissionTierSettings>;
  onFormChange: (form: Partial<CommissionTierSettings>) => void;
}

const commissionTypes = [
  { value: "percentage", label: "Pourcentage" },
  { value: "fixed", label: "Montant fixe" },
  { value: "percentage_plus_fixed", label: "Pourcentage + montant fixe" },
  { value: "percentage_with_minimum", label: "Pourcentage avec minimum fixe" }
];

export function CommissionTierForm({ editForm, onFormChange }: CommissionTierFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label>Nom du palier</Label>
          <Input
            value={editForm.name || ''}
            onChange={(e) => onFormChange({...editForm, name: e.target.value})}
          />
        </div>
        <div>
          <Label>Type de commission</Label>
          <Select
            value={editForm.type}
            onValueChange={(value: any) => onFormChange({...editForm, type: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {commissionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Montant min (€)</Label>
          <Input
            type="number"
            value={editForm.minAmount ?? ''}
            onChange={(e) => onFormChange({...editForm, minAmount: parseFloat(e.target.value)})}
          />
        </div>
        <div>
          <Label>Montant max (€)</Label>
          <Input
            type="number"
            value={editForm.maxAmount ?? ''}
            onChange={(e) => onFormChange({...editForm, maxAmount: parseFloat(e.target.value) || undefined})}
            placeholder="Illimité"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Pourcentage (%)</Label>
          <Input
            type="number"
            step="0.1"
            value={editForm.percentage ?? ''}
            onChange={(e) => onFormChange({...editForm, percentage: parseFloat(e.target.value)})}
          />
        </div>
        <div>
          <Label>Montant fixe (€)</Label>
          <Input
            type="number"
            step="0.01"
            value={editForm.fixedAmount ?? ''}
            onChange={(e) => onFormChange({...editForm, fixedAmount: parseFloat(e.target.value)})}
          />
        </div>
      </div>
    </div>
  );
}
