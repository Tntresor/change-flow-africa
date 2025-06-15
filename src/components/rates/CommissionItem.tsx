
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommissionTierSettings } from "@/types/rates";
import { Edit, Save, X } from "lucide-react";

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

export function CommissionItem({ 
  commission, 
  isEditing, 
  editForm, 
  onEdit, 
  onSave, 
  onCancel, 
  onToggleActive, 
  onFormChange 
}: CommissionItemProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h4 className="font-medium">{commission.name}</h4>
          <Badge variant={commission.type === 'percentage' ? 'default' : 'secondary'}>
            {commission.type === 'percentage' ? 'Pourcentage' : 'Fixe'}
          </Badge>
          <Switch
            checked={commission.isActive}
            onCheckedChange={() => onToggleActive(commission.id)}
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
            <Button size="sm" variant="outline" onClick={() => onEdit(commission)}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label>Type</Label>
            <Select
              value={editForm.type}
              onValueChange={(value: 'percentage' | 'fixed') => 
                onFormChange({...editForm, type: value})
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Pourcentage</SelectItem>
                <SelectItem value="fixed">Fixe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Valeur</Label>
            <Input
              type="number"
              step="0.01"
              value={editForm.value || ''}
              onChange={(e) => onFormChange({...editForm, value: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <Label>Montant min</Label>
            <Input
              type="number"
              step="0.01"
              value={editForm.minAmount || ''}
              onChange={(e) => onFormChange({...editForm, minAmount: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <Label>Montant max</Label>
            <Input
              type="number"
              step="0.01"
              value={editForm.maxAmount || ''}
              onChange={(e) => onFormChange({...editForm, maxAmount: parseFloat(e.target.value)})}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Valeur:</span>
            <div className="font-semibold">
              {commission.value}{commission.type === 'percentage' ? '%' : ` ${commission.currency}`}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Min:</span>
            <div className="font-semibold">{commission.minAmount || '-'}</div>
          </div>
          <div>
            <span className="text-gray-500">Max:</span>
            <div className="font-semibold">{commission.maxAmount || '-'}</div>
          </div>
          <div>
            <span className="text-gray-500">Devise:</span>
            <div className="font-semibold">{commission.currency}</div>
          </div>
        </div>
      )}
    </div>
  );
}
