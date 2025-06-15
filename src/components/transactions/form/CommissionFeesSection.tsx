
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CommissionFeesSectionProps {
  manualCommission: number;
  manualFees: number;
  onCommissionChange: (commission: number) => void;
  onFeesChange: (fees: number) => void;
}

export function CommissionFeesSection({
  manualCommission,
  manualFees,
  onCommissionChange,
  onFeesChange
}: CommissionFeesSectionProps) {
  return (
    <div className="border rounded-lg p-4 bg-blue-50">
      <Label className="text-base font-medium mb-3 block">Commissions et Frais</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gray-600">Commission</Label>
          <Input
            type="number"
            step="0.01"
            value={manualCommission}
            onChange={(e) => onCommissionChange(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label className="text-sm text-gray-600">Frais additionnels</Label>
          <Input
            type="number"
            step="0.01"
            value={manualFees}
            onChange={(e) => onFeesChange(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );
}
