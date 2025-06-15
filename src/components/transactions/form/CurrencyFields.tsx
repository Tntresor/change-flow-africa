
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormData } from "./TransactionFormData";

interface CurrencyFieldsProps {
  form: UseFormReturn<TransactionFormData>;
  onCurrencyChange: () => void;
}

export function CurrencyFields({ form, onCurrencyChange }: CurrencyFieldsProps) {
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
                  <SelectValue placeholder="EUR, USD, GBP..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="USD">USD - Dollar US</SelectItem>
                <SelectItem value="GBP">GBP - Livre Sterling</SelectItem>
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
                  <SelectValue placeholder="EUR, USD, GBP..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="USD">USD - Dollar US</SelectItem>
                <SelectItem value="GBP">GBP - Livre Sterling</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
