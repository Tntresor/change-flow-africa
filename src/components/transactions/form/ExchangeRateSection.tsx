
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { mockExchangeRates } from "@/data/ratesData";
import { TransactionFormData } from "./TransactionFormData";

interface ExchangeRateSectionProps {
  watchedValues: TransactionFormData;
  manualRateEnabled: boolean;
  manualRate: number;
  calculatedAmount: number;
  onManualRateToggle: (enabled: boolean) => void;
  onManualRateChange: (rate: number) => void;
}

export function ExchangeRateSection({
  watchedValues,
  manualRateEnabled,
  manualRate,
  calculatedAmount,
  onManualRateToggle,
  onManualRateChange
}: ExchangeRateSectionProps) {
  const currentRate = watchedValues.fromCurrency && watchedValues.toCurrency ? 
    mockExchangeRates.find(
      rate => rate.fromCurrency === watchedValues.fromCurrency && 
              rate.toCurrency === watchedValues.toCurrency
    )?.finalRate || 0 : 0;

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <Label className="text-base font-medium">Taux de Change</Label>
        <div className="flex items-center gap-2">
          <Label htmlFor="manual-rate" className="text-sm">Mode manuel</Label>
          <Switch
            id="manual-rate"
            checked={manualRateEnabled}
            onCheckedChange={onManualRateToggle}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-sm text-gray-600">Taux actuel</Label>
          <div className="font-semibold">
            {currentRate ? currentRate.toFixed(4) : "N/A"}
          </div>
        </div>
        <div>
          <Label className="text-sm text-gray-600">Taux appliqué</Label>
          {manualRateEnabled ? (
            <Input
              type="number"
              step="0.0001"
              value={manualRate}
              onChange={(e) => onManualRateChange(parseFloat(e.target.value) || 0)}
            />
          ) : (
            <div className="font-semibold text-green-600">
              {manualRate.toFixed(4)}
            </div>
          )}
        </div>
        <div>
          <Label className="text-sm text-gray-600">Montant converti</Label>
          <div className="font-semibold text-blue-600">
            {calculatedAmount.toFixed(2)} {watchedValues.toCurrency}
          </div>
        </div>
      </div>
    </div>
  );
}
