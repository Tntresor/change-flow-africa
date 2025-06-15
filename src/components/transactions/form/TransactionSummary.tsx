
import { TransactionFormData } from "./TransactionFormData";

interface TransactionSummaryProps {
  watchedValues: TransactionFormData;
  manualCommission: number;
  manualFees: number;
  calculatedAmount: number;
}

export function TransactionSummary({
  watchedValues,
  manualCommission,
  manualFees,
  calculatedAmount
}: TransactionSummaryProps) {
  if (!watchedValues.amount || !watchedValues.fromCurrency || !watchedValues.toCurrency) {
    return null;
  }

  return (
    <div className="border rounded-lg p-4 bg-green-50">
      <h4 className="font-medium mb-2">Récapitulatif de la transaction</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Montant initial:</span>
          <div className="font-semibold">{watchedValues.amount} {watchedValues.fromCurrency}</div>
        </div>
        <div>
          <span className="text-gray-600">Commission:</span>
          <div className="font-semibold">{manualCommission.toFixed(2)} {watchedValues.fromCurrency}</div>
        </div>
        <div>
          <span className="text-gray-600">Frais:</span>
          <div className="font-semibold">{manualFees.toFixed(2)} {watchedValues.fromCurrency}</div>
        </div>
        <div>
          <span className="text-gray-600">Montant final:</span>
          <div className="font-semibold text-green-600">{calculatedAmount.toFixed(2)} {watchedValues.toCurrency}</div>
        </div>
      </div>
    </div>
  );
}
