
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExchangeRateSettings } from "@/types/rates";

interface ExchangeRateEditFormProps {
  editForm: Partial<ExchangeRateSettings>;
  setEditForm: (form: Partial<ExchangeRateSettings>) => void;
  calculateBidAskFromInputs: (baseRate: number, totalSpread: number) => { bidRate: number; askRate: number };
}

export function ExchangeRateEditForm({ editForm, setEditForm, calculateBidAskFromInputs }: ExchangeRateEditFormProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div>
        <Label>Taux de base</Label>
        <Input
          type="number"
          step="0.0001"
          value={editForm.baseRate || ''}
          onChange={(e) => setEditForm({...editForm, baseRate: parseFloat(e.target.value)})}
        />
      </div>
      <div>
        <Label>Spread total</Label>
        <Input
          type="number"
          step="0.0001"
          value={editForm.totalSpread || ''}
          onChange={(e) => setEditForm({...editForm, totalSpread: parseFloat(e.target.value)})}
        />
      </div>
      <div>
        <Label>Taux Bid</Label>
        <Input
          value={editForm.baseRate && editForm.totalSpread ? 
            (editForm.baseRate - editForm.totalSpread / 2).toFixed(4) : ''}
          readOnly
          className="bg-gray-50"
        />
      </div>
      <div>
        <Label>Taux Ask</Label>
        <Input
          value={editForm.baseRate && editForm.totalSpread ? 
            (editForm.baseRate + editForm.totalSpread / 2).toFixed(4) : ''}
          readOnly
          className="bg-gray-50"
        />
      </div>
      <div>
        <Label>Spread (%)</Label>
        <Input
          value={editForm.baseRate && editForm.totalSpread ? 
            ((editForm.totalSpread / editForm.baseRate) * 100).toFixed(2) : '0.00'}
          readOnly
          className="bg-gray-50"
        />
      </div>
    </div>
  );
}
