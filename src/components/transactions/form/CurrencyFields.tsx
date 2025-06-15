
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormData } from "./TransactionFormData";
import { useCurrencyManager } from "@/components/settings/hooks/useCurrencyManager";

interface CurrencyFieldsProps {
  form: UseFormReturn<TransactionFormData>;
  onCurrencyChange: () => void;
}

export function CurrencyFields({ form, onCurrencyChange }: CurrencyFieldsProps) {
  const { currencies } = useCurrencyManager();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="fromCurrency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Devise source</FormLabel>
            <Select onValueChange={(value) => {
              field.onChange(value);
              onCurrencyChange();
            }} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une devise..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name} ({currency.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="toCurrency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Devise destination</FormLabel>
            <Select onValueChange={(value) => {
              field.onChange(value);
              onCurrencyChange();
            }} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une devise..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name} ({currency.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
