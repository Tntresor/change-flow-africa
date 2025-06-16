
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X } from "lucide-react";
import { CommissionTierSettings } from "@/types/rates";

interface CommissionItemProps {
  commission: CommissionTierSettings;
  isEditing: boolean;
  editForm: Partial<CommissionTierSettings>;
  onEdit: (commission: CommissionTierSettings) => void;
  onSave: () => void;
  onCancel: () => void;
  onToggleActive: (id: string) => void;
  onFormChange: (form: Partial<CommissionTierSettings>) => void;
}

const transactionTypes = [
  { value: "currency_exchange", label: "Change de devises" },
  { value: "internal_transfer", label: "Transfert interne" },
  { value: "international_transfer", label: "Transfert international" },
  { value: "payment", label: "Paiement" },
  { value: "all", label: "Tous types" }
];

export function CommissionItem({
  commission,
  isEditing,
  editForm,
  onEdit,
  onSave,
  onCancel,
  onToggleActive,
  onFormChange,
}: CommissionItemProps) {
  const getTypeLabel = (type: string) => {
    return transactionTypes.find(t => t.value === type)?.label || "Non spécifié";
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h4 className="font-medium">{commission.name}</h4>
          <Badge variant={commission.isActive ? "default" : "secondary"}>
            {commission.isActive ? "Actif" : "Inactif"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={commission.isActive}
            onCheckedChange={() => onToggleActive(commission.id)}
          />
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => onEdit(commission)}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nom</Label>
              <Input
                value={editForm.name || ""}
                onChange={(e) => onFormChange({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Type de transaction</Label>
              <Select
                value={editForm.transactionType || "all"}
                onValueChange={(value) => onFormChange({ ...editForm, transactionType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {transactionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Montant minimum</Label>
              <Input
                type="number"
                value={editForm.minAmount || ""}
                onChange={(e) => onFormChange({ ...editForm, minAmount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Montant maximum</Label>
              <Input
                type="number"
                value={editForm.maxAmount || ""}
                onChange={(e) => onFormChange({ ...editForm, maxAmount: parseFloat(e.target.value) || undefined })}
              />
            </div>
            <div>
              <Label>Devise</Label>
              <Input
                value={editForm.currency || ""}
                onChange={(e) => onFormChange({ ...editForm, currency: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Montant fixe</Label>
              <Input
                type="number"
                step="0.01"
                value={editForm.fixedAmount || ""}
                onChange={(e) => onFormChange({ ...editForm, fixedAmount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Pourcentage (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={editForm.percentage || ""}
                onChange={(e) => onFormChange({ ...editForm, percentage: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={onSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
            <Button variant="outline" onClick={onCancel} size="sm">
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Type de transaction:</span>
              <div className="font-medium">{getTypeLabel(commission.transactionType || "all")}</div>
            </div>
            <div>
              <span className="text-gray-600">Plage de montant:</span>
              <div className="font-medium">
                {commission.minAmount}€ - {commission.maxAmount ? `${commission.maxAmount}€` : "Illimité"}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Montant fixe:</span>
              <div className="font-medium">{commission.fixedAmount}€</div>
            </div>
            <div>
              <span className="text-gray-600">Pourcentage:</span>
              <div className="font-medium">{commission.percentage}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
