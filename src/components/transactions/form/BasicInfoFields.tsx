
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormData, mockAgencies } from "./TransactionFormData";

interface BasicInfoFieldsProps {
  form: UseFormReturn<TransactionFormData>;
  onAmountChange: () => void;
}

export function BasicInfoFields({ form, onAmountChange }: BasicInfoFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Montant</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...field}
                onChange={(e) => {
                  field.onChange(parseFloat(e.target.value) || 0);
                  onAmountChange();
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="agencyId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agence</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une agence" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {mockAgencies.map((agency) => (
                  <SelectItem key={agency.id} value={agency.id}>
                    {agency.name} ({agency.code})
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
