
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import { Calculator } from "lucide-react";
import { useAddTransactionForm } from "./form/useAddTransactionForm";
import { AddTransactionFormContent } from "./form/AddTransactionFormContent";

interface AddTransactionFormProps {
  onSuccess: (transaction: Transaction) => void;
  onCancel: () => void;
}

export function AddTransactionForm({ onSuccess, onCancel }: AddTransactionFormProps) {
  const {
    form,
    watchedValues,
    onSubmit,
    manualRateEnabled,
    setManualRateEnabled,
    manualRate,
    setManualRate,
    manualCommission,
    setManualCommission,
    manualFees,
    setManualFees,
    calculatedAmount,
    calculateTransaction
  } = useAddTransactionForm({ onSuccess });

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Nouvelle Transaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AddTransactionFormContent
          form={form}
          watchedValues={watchedValues}
          onSubmit={onSubmit}
          onCancel={onCancel}
          manualRateEnabled={manualRateEnabled}
          manualRate={manualRate}
          manualCommission={manualCommission}
          manualFees={manualFees}
          calculatedAmount={calculatedAmount}
          onManualRateToggle={setManualRateEnabled}
          onManualRateChange={setManualRate}
          onCommissionChange={setManualCommission}
          onFeesChange={setManualFees}
          onCalculateTransaction={calculateTransaction}
        />
      </CardContent>
    </Card>
  );
}
