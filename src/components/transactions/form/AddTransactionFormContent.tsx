
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormData } from "./TransactionFormData";
import { BasicInfoFields } from "./BasicInfoFields";
import { CurrencyFields } from "./CurrencyFields";
import { ExchangeRateSection } from "./ExchangeRateSection";
import { CommissionFeesSection } from "./CommissionFeesSection";
import { CustomerCategoryFields } from "./CustomerCategoryFields";
import { TransactionSummary } from "./TransactionSummary";
import { TransactionFormActions } from "./TransactionFormActions";

interface AddTransactionFormContentProps {
  form: UseFormReturn<TransactionFormData>;
  watchedValues: TransactionFormData;
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  manualRateEnabled: boolean;
  manualRate: number;
  manualCommission: number;
  manualFees: number;
  calculatedAmount: number;
  onManualRateToggle: (enabled: boolean) => void;
  onManualRateChange: (rate: number) => void;
  onCommissionChange: (commission: number) => void;
  onFeesChange: (fees: number) => void;
  onCalculateTransaction: () => void;
}

export function AddTransactionFormContent({
  form,
  watchedValues,
  onSubmit,
  onCancel,
  manualRateEnabled,
  manualRate,
  manualCommission,
  manualFees,
  calculatedAmount,
  onManualRateToggle,
  onManualRateChange,
  onCommissionChange,
  onFeesChange,
  onCalculateTransaction
}: AddTransactionFormContentProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoFields form={form} onAmountChange={onCalculateTransaction} />
        
        <CurrencyFields form={form} onCurrencyChange={onCalculateTransaction} />
        
        <ExchangeRateSection
          watchedValues={watchedValues}
          manualRateEnabled={manualRateEnabled}
          manualRate={manualRate}
          calculatedAmount={calculatedAmount}
          onManualRateToggle={onManualRateToggle}
          onManualRateChange={(rate) => {
            onManualRateChange(rate);
            onCalculateTransaction();
          }}
        />

        <CommissionFeesSection
          manualCommission={manualCommission}
          manualFees={manualFees}
          onCommissionChange={(commission) => {
            onCommissionChange(commission);
            onCalculateTransaction();
          }}
          onFeesChange={(fees) => {
            onFeesChange(fees);
            onCalculateTransaction();
          }}
        />

        <CustomerCategoryFields form={form} />

        <TransactionSummary
          watchedValues={watchedValues}
          manualCommission={manualCommission}
          manualFees={manualFees}
          calculatedAmount={calculatedAmount}
        />

        <TransactionFormActions onCancel={onCancel} />
      </form>
    </Form>
  );
}
