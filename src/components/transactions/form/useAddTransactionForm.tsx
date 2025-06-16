
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Transaction, TransactionCategory } from "@/types/transaction";
import { mockExchangeRates } from "@/data/ratesData";
import { useToast } from "@/hooks/use-toast";
import { useTransactionCalculation } from "@/hooks/useTransactionCalculation";
import { 
  transactionSchema, 
  TransactionFormData, 
  mockAgencies, 
  mockCategories 
} from "./TransactionFormData";

interface UseAddTransactionFormProps {
  onSuccess: (transaction: Transaction) => void;
}

export function useAddTransactionForm({ onSuccess }: UseAddTransactionFormProps) {
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

  const createTransaction = (data: TransactionFormData): Transaction => {
    const selectedCategory = mockCategories.find(c => c.id === data.category);
    const selectedAgency = mockAgencies.find(a => a.id === data.agencyId);
    
    if (!selectedCategory || !selectedAgency) {
      throw new Error("Catégorie ou agence non trouvée");
    }

    const exchangeRateData = mockExchangeRates.find(
      rate => rate.fromCurrency === data.fromCurrency && rate.toCurrency === data.toCurrency
    );

    // Utiliser le taux Ask pour la transaction (nous vendons la devise cible)
    const appliedRate = manualRateEnabled ? manualRate : (exchangeRateData?.askRate || 1);
    const totalSpread = exchangeRateData?.totalSpread || 0;

    return {
      id: `txn_${Date.now()}`,
      type: 'currency_exchange',
      amount: data.amount,
      fromCurrency: data.fromCurrency,
      toCurrency: data.toCurrency,
      exchangeRate: exchangeRateData?.baseRate || appliedRate, // Taux de base pour référence
      spread: totalSpread,
      finalRate: appliedRate, // Taux réellement appliqué (Ask)
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
      isOffline: false,
      prefixId: `${selectedAgency.code}_${Date.now().toString().slice(-6)}`,
      category: selectedCategory,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
    };
  };

  const onSubmit = (data: TransactionFormData) => {
    try {
      const newTransaction = createTransaction(data);
      onSuccess(newTransaction);
      
      toast({
        title: "Transaction créée",
        description: `Transaction ${newTransaction.prefixId} créée avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  return {
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
  };
}
