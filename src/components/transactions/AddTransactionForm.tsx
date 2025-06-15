
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Transaction } from "@/types/transaction";
import { mockExchangeRates } from "@/data/ratesData";
import { Calculator, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTransactionCalculation } from "@/hooks/useTransactionCalculation";
import { 
  transactionSchema, 
  TransactionFormData, 
  mockAgencies, 
  mockCategories 
} from "./form/TransactionFormData";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { CurrencyFields } from "./form/CurrencyFields";
import { ExchangeRateSection } from "./form/ExchangeRateSection";
import { CommissionFeesSection } from "./form/CommissionFeesSection";
import { CustomerCategoryFields } from "./form/CustomerCategoryFields";
import { TransactionSummary } from "./form/TransactionSummary";

interface AddTransactionFormProps {
  onSuccess: (transaction: Transaction) => void;
  onCancel: () => void;
}

export function AddTransactionForm({ onSuccess, onCancel }: AddTransactionFormProps) {
  const { toast } = useToast();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      fromCurrency: "",
      toCurrency: "",
      agencyId: "",
      customerName: "",
      customerPhone: "",
      category: "",
    },
  });

  const watchedValues = form.watch();

  const {
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
  } = useTransactionCalculation(watchedValues);

  const onSubmit = (data: TransactionFormData) => {
    const selectedCategory = mockCategories.find(c => c.id === data.category);
    const selectedAgency = mockAgencies.find(a => a.id === data.agencyId);
    
    if (!selectedCategory || !selectedAgency) {
      toast({
        title: "Erreur",
        description: "Catégorie ou agence non trouvée",
        variant: "destructive",
      });
      return;
    }

    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'currency_exchange',
      amount: data.amount,
      fromCurrency: data.fromCurrency,
      toCurrency: data.toCurrency,
      exchangeRate: manualRateEnabled ? manualRate : (mockExchangeRates.find(
        rate => rate.fromCurrency === data.fromCurrency && rate.toCurrency === data.toCurrency
      )?.finalRate || 1),
      spread: 0,
      finalRate: manualRate,
      convertedAmount: calculatedAmount,
      commission: {
        amount: manualCommission,
        percentage: 0,
        tier: {
          id: '1',
          name: 'Standard',
          minAmount: 0,
          fixedAmount: manualCommission,
          percentage: 0
        },
        totalCommission: manualCommission
      },
      fees: manualFees,
      status: 'pending',
      timestamp: new Date(),
      agencyId: data.agencyId,
      agencyName: selectedAgency.name,
      origin: {
        type: 'agency',
        id: data.agencyId,
        name: selectedAgency.name,
        country: 'France',
        code: selectedAgency.code
      },
      destination: {
        type: 'agency',
        id: data.agencyId,
        name: selectedAgency.name,
        country: 'France',
        code: selectedAgency.code
      },
      sender: {
        name: data.customerName || 'Client anonyme',
        phone: data.customerPhone
      },
      receiver: {
        name: data.customerName || 'Client anonyme',
        phone: data.customerPhone
      },
      validationType: 'none',
      prefixId: `${selectedAgency.code}_${Date.now().toString().slice(-6)}`,
      category: selectedCategory,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
    };

    onSuccess(newTransaction);
    
    toast({
      title: "Transaction créée",
      description: `Transaction ${newTransaction.prefixId} créée avec succès`,
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Nouvelle Transaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BasicInfoFields form={form} onAmountChange={calculateTransaction} />
            
            <CurrencyFields form={form} onCurrencyChange={calculateTransaction} />
            
            <ExchangeRateSection
              watchedValues={watchedValues}
              manualRateEnabled={manualRateEnabled}
              manualRate={manualRate}
              calculatedAmount={calculatedAmount}
              onManualRateToggle={setManualRateEnabled}
              onManualRateChange={(rate) => {
                setManualRate(rate);
                calculateTransaction();
              }}
            />

            <CommissionFeesSection
              manualCommission={manualCommission}
              manualFees={manualFees}
              onCommissionChange={(commission) => {
                setManualCommission(commission);
                calculateTransaction();
              }}
              onFeesChange={(fees) => {
                setManualFees(fees);
                calculateTransaction();
              }}
            />

            <CustomerCategoryFields form={form} />

            <TransactionSummary
              watchedValues={watchedValues}
              manualCommission={manualCommission}
              manualFees={manualFees}
              calculatedAmount={calculatedAmount}
            />

            <div className="flex items-center gap-3 pt-4">
              <Button type="submit" className="gap-2">
                <Save className="w-4 h-4" />
                Créer la transaction
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
                <X className="w-4 h-4" />
                Annuler
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
