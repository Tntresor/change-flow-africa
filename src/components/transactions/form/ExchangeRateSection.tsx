
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { InfoIcon, TrendingUp, TrendingDown } from "lucide-react";
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
  const totalSpread = exchangeRateData?.totalSpread || 0;
  const bidRate = exchangeRateData?.bidRate || 0;
  const askRate = exchangeRateData?.askRate || 0;
  const halfSpread = totalSpread / 2;
  const spreadPercentage = baseRate > 0 ? (totalSpread / baseRate) * 100 : 0;

  // Déterminer quel taux utiliser (Ask pour la vente de devise cible au client)
  const applicableRate = askRate; // Le client achète la devise cible, nous vendons

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <Label className="text-base font-medium">Taux de Change (Modèle Bid/Ask)</Label>
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
              <div className="font-medium mb-2">Explication du modèle Bid/Ask :</div>
              <ul className="space-y-1 text-xs">
                <li>• <strong>Taux de base (Mid-market) :</strong> {baseRate.toFixed(4)} - cotation interbancaire</li>
                <li>• <strong>Spread total :</strong> {totalSpread.toFixed(4)} ({spreadPercentage.toFixed(2)}%) - réparti équitablement</li>
                <li className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-red-600" />
                  <strong>Taux Bid (achat) :</strong> {bidRate.toFixed(4)} = base - {halfSpread.toFixed(4)}
                </li>
                <li className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <strong>Taux Ask (vente) :</strong> {askRate.toFixed(4)} = base + {halfSpread.toFixed(4)}
                </li>
                <li className="text-green-700 font-medium mt-2">
                  • Transaction client : <strong>Taux Ask appliqué</strong> (vous vendez {watchedValues.toCurrency} au client)
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <Label className="text-sm text-gray-600">Taux de base</Label>
          <div className="font-semibold text-gray-700">
            {baseRate ? baseRate.toFixed(4) : "N/A"}
          </div>
          <div className="text-xs text-gray-500">Mid-market</div>
        </div>
        
        <div>
          <Label className="text-sm text-gray-600 flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-red-600" />
            Taux Bid
          </Label>
          <div className="font-semibold text-red-600">
            {bidRate ? bidRate.toFixed(4) : "N/A"}
          </div>
          <div className="text-xs text-gray-500">Nous achetons</div>
        </div>
        
        <div>
          <Label className="text-sm text-gray-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-600" />
            Taux Ask
          </Label>
          <div className="font-semibold text-green-600">
            {askRate ? askRate.toFixed(4) : "N/A"}
          </div>
          <div className="text-xs text-gray-500">Nous vendons</div>
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
              {applicableRate.toFixed(4)}
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

      <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
        <div className="text-xs text-yellow-800">
          <strong>Spread total :</strong> {totalSpread.toFixed(4)} ({spreadPercentage.toFixed(2)}%) = 
          Différence entre Ask et Bid • Votre marge sur cette transaction
        </div>
      </div>
    </div>
  );
}
