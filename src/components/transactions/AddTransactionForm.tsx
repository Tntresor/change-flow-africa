
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Transaction, TransactionCategory } from "@/types/transaction";
import { mockExchangeRates, mockCommissions, mockFees } from "@/data/ratesData";
import { Calculator, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const transactionSchema = z.object({
  amount: z.number().min(0.01, "Le montant doit être supérieur à 0"),
  fromCurrency: z.string().min(1, "Devise source requise"),
  toCurrency: z.string().min(1, "Devise de destination requise"),
  agencyId: z.string().min(1, "Agence requise"),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  category: z.string().min(1, "Catégorie requise"),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface AddTransactionFormProps {
  onSuccess: (transaction: Transaction) => void;
  onCancel: () => void;
}

const mockAgencies = [
  { id: "1", name: "Agence Paris Centre", code: "PAR01" },
  { id: "2", name: "Agence Lyon", code: "LYO01" },
  { id: "3", name: "Agence Marseille", code: "MAR01" },
];

const mockCategories: TransactionCategory[] = [
  { id: "1", name: "Virement", color: "bg-blue-500", icon: "arrow-right" },
  { id: "2", name: "Change", color: "bg-green-500", icon: "exchange" },
  { id: "3", name: "Transfert", color: "bg-purple-500", icon: "send" },
];

export function AddTransactionForm({ onSuccess, onCancel }: AddTransactionFormProps) {
  const { toast } = useToast();
  const [manualRateEnabled, setManualRateEnabled] = useState(false);
  const [manualRate, setManualRate] = useState<number>(0);
  const [manualCommission, setManualCommission] = useState<number>(0);
  const [manualFees, setManualFees] = useState<number>(0);
  const [calculatedAmount, setCalculatedAmount] = useState<number>(0);

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

  // Calcul automatique du taux et des frais
  const calculateTransaction = () => {
    const { amount, fromCurrency, toCurrency } = watchedValues;
    
    if (!amount || !fromCurrency || !toCurrency) return;

    // Trouver le taux de change
    const exchangeRate = mockExchangeRates.find(
      rate => rate.fromCurrency === fromCurrency && rate.toCurrency === toCurrency && rate.isActive
    );

    const currentRate = manualRateEnabled ? manualRate : (exchangeRate?.finalRate || 1);
    
    // Calculer la commission
    const activeCommission = mockCommissions.find(c => c.isActive);
    let commission = manualCommission;
    if (!manualCommission && activeCommission) {
      commission = activeCommission.type === 'percentage' 
        ? (amount * activeCommission.value / 100)
        : activeCommission.value;
    }

    // Calculer les frais
    const activeFees = mockFees.filter(f => f.isActive);
    const totalFees = manualFees || activeFees.reduce((sum, fee) => sum + fee.amount, 0);

    // Montant final
    const convertedAmount = (amount - commission - totalFees) * currentRate;
    setCalculatedAmount(convertedAmount);

    // Mettre à jour le taux manuel si pas activé
    if (!manualRateEnabled && exchangeRate) {
      setManualRate(exchangeRate.finalRate);
    }
  };

  // Recalculer quand les valeurs changent
  useState(() => {
    calculateTransaction();
  });

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
      amount: data.amount,
      fromCurrency: data.fromCurrency,
      toCurrency: data.toCurrency,
      exchangeRate: manualRateEnabled ? manualRate : (mockExchangeRates.find(
        rate => rate.fromCurrency === data.fromCurrency && rate.toCurrency === data.toCurrency
      )?.finalRate || 1),
      convertedAmount: calculatedAmount,
      status: 'pending',
      timestamp: new Date(),
      agencyId: data.agencyId,
      agencyName: selectedAgency.name,
      category: selectedCategory,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      validationType: 'none',
      prefixId: `${selectedAgency.code}_${Date.now().toString().slice(-6)}`,
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
            {/* Informations de base */}
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
                          calculateTransaction();
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

            {/* Devises */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fromCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Devise source</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      calculateTransaction();
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
                      calculateTransaction();
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

            {/* Taux de change */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-medium">Taux de Change</Label>
                <div className="flex items-center gap-2">
                  <Label htmlFor="manual-rate" className="text-sm">Mode manuel</Label>
                  <Switch
                    id="manual-rate"
                    checked={manualRateEnabled}
                    onCheckedChange={setManualRateEnabled}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Taux actuel</Label>
                  <div className="font-semibold">
                    {watchedValues.fromCurrency && watchedValues.toCurrency ? (
                      mockExchangeRates.find(
                        rate => rate.fromCurrency === watchedValues.fromCurrency && 
                                rate.toCurrency === watchedValues.toCurrency
                      )?.finalRate.toFixed(4) || "N/A"
                    ) : "N/A"}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Taux appliqué</Label>
                  {manualRateEnabled ? (
                    <Input
                      type="number"
                      step="0.0001"
                      value={manualRate}
                      onChange={(e) => {
                        setManualRate(parseFloat(e.target.value) || 0);
                        calculateTransaction();
                      }}
                    />
                  ) : (
                    <div className="font-semibold text-green-600">
                      {manualRate.toFixed(4)}
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Montant converti</Label>
                  <div className="font-semibold text-blue-600">
                    {calculatedAmount.toFixed(2)} {watchedValues.toCurrency}
                  </div>
                </div>
              </div>
            </div>

            {/* Commissions et frais */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <Label className="text-base font-medium mb-3 block">Commissions et Frais</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Commission</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={manualCommission}
                    onChange={(e) => {
                      setManualCommission(parseFloat(e.target.value) || 0);
                      calculateTransaction();
                    }}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Frais additionnels</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={manualFees}
                    onChange={(e) => {
                      setManualFees(parseFloat(e.target.value) || 0);
                      calculateTransaction();
                    }}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Informations client et catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 ${category.color} rounded-full`}></div>
                              {category.name}
                            </div>
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
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du client (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Jean Dupont" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="+33 1 23 45 67 89" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Récapitulatif */}
            {watchedValues.amount > 0 && watchedValues.fromCurrency && watchedValues.toCurrency && (
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
            )}

            {/* Boutons d'action */}
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
