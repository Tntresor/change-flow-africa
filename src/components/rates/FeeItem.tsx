
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeeSettings } from "@/types/rates";
import { Edit, Save, X, Trash2 } from "lucide-react";

interface FeeItemProps {
  fee: FeeSettings;
  isEditing: boolean;
  editForm: Partial<FeeSettings>;
  onEdit: (fee: FeeSettings) => void;
  onSave: () => void;
  onCancel: () => void;
  onToggleActive: (id: string) => void;
  onFormChange: (form: Partial<FeeSettings>) => void;
  onDelete: (id: string) => void;
}

export function FeeItem({ 
  fee, 
  isEditing, 
  editForm, 
  onEdit, 
  onSave, 
  onCancel, 
  onToggleActive, 
  onFormChange,
  onDelete
}: FeeItemProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h4 className="font-medium">{fee.name}</h4>
          <Switch
            checked={fee.isActive}
            onCheckedChange={() => onToggleActive(fee.id)}
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
              <Button size="sm" variant="outline" onClick={() => onEdit(fee)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(fee.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label>Nom</Label>
            <Input
              value={editForm.name || ''}
              onChange={(e) => onFormChange({...editForm, name: e.target.value})}
            />
          </div>
          <div>
            <Label>Montant</Label>
            <Input
              type="number"
              step="0.01"
              value={editForm.amount || ''}
              onChange={(e) => onFormChange({...editForm, amount: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <Label>Devise</Label>
            <Select
              value={editForm.currency}
              onValueChange={(value) => onFormChange({...editForm, currency: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="XOF">XOF</SelectItem>
                <SelectItem value="MAD">MAD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={editForm.description || ''}
              onChange={(e) => onFormChange({...editForm, description: e.target.value})}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Montant:</span>
            <div className="font-semibold">{fee.amount} {fee.currency}</div>
          </div>
          <div>
            <span className="text-gray-500">Devise:</span>
            <div className="font-semibold">{fee.currency}</div>
          </div>
          <div>
            <span className="text-gray-500">Description:</span>
            <div className="font-semibold">{fee.description || '-'}</div>
          </div>
          <div>
            <span className="text-gray-500">Type de transaction:</span>
            <div className="font-semibold">{fee.transactionType || 'Tous'}</div>
          </div>
        </div>
      )}
    </div>
  );
}
