
import { ExchangeRateDisplay } from "@/features/exchange-rates/components/ExchangeRateDisplay";
import { TransactionFormData } from "./TransactionFormData";

interface ExchangeRateSectionProps {
  watchedValues: TransactionFormData;
  manualRateEnabled: boolean;
  manualRate: number;
  calculatedAmount: number;
  onManualRateToggle: (enabled: boolean) => void;
  onManualRateChange: (rate: number) => void;
}

export function ExchangeRateSection(props: ExchangeRateSectionProps) {
  return <ExchangeRateDisplay {...props} />;
}
