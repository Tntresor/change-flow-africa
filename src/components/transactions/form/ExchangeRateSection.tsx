
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { InfoIcon } from "lucide-react";
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
  const exchangeRateData = watchedValues.fromCurrency && watchedValues.toCurrency ? 
    mockExchangeRates.find(
      rate => rate.fromCurrency === watchedValues.fromCurrency && 
              rate.toCurrency === watchedValues.toCurrency
    ) : null;

  const baseRate = exchangeRateData?.baseRate || 0;
  const spread = exchangeRateData?.spread || 0;
  const finalRate = exchangeRateData?.finalRate || 0;

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
      
      {exchangeRateData && (
        <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
          <div className="flex items-start gap-2">
            <InfoIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-1">Explication du taux :</div>
              <ul className="space-y-1 text-xs">
                <li>• <strong>Taux de base :</strong> {baseRate.toFixed(4)} (taux du marché interbancaire)</li>
                <li>• <strong>Spread :</strong> +{spread.toFixed(4)} (marge appliquée en votre faveur)</li>
                <li>• <strong>Taux final :</strong> {finalRate.toFixed(4)} (taux que vous appliquez au client)</li>
                <li className="text-green-700 font-medium">• Le spread de {spread.toFixed(4)} vous garantit une marge sur chaque transaction</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label className="text-sm text-gray-600">Taux de base</Label>
          <div className="font-semibold text-gray-700">
            {baseRate ? baseRate.toFixed(4) : "N/A"}
          </div>
          <div className="text-xs text-gray-500">Marché interbancaire</div>
        </div>
        <div>
          <Label className="text-sm text-gray-600">Spread</Label>
          <div className="font-semibold text-green-600">
            +{spread ? spread.toFixed(4) : "N/A"}
          </div>
          <div className="text-xs text-gray-500">Votre marge</div>
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
            <div className="font-semibold text-blue-600">
              {manualRate.toFixed(4)}
            </div>
          )}
          <div className="text-xs text-gray-500">Taux client final</div>
        </div>
        <div>
          <Label className="text-sm text-gray-600">Montant converti</Label>
          <div className="font-semibold text-blue-600">
            {calculatedAmount.toFixed(2)} {watchedValues.toCurrency}
          </div>
          <div className="text-xs text-gray-500">Montant final client</div>
        </div>
      </div>
    </div>
  );
}
