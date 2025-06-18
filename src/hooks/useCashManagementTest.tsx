
import { useState } from "react";
import { mockAgencyCashSummaries } from "@/data/mockCashManagementData";
import { CashManagementService } from "@/features/cash-management/services/cashManagementService";
import { CashTransferRequest, AgencyCashSummary } from "@/types/cashManagement";
import { useToast } from "@/hooks/use-toast";

export function useCashManagementTest() {
  const [cashSummaries, setCashSummaries] = useState<AgencyCashSummary[]>(mockAgencyCashSummaries);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Calculate total cash across all agencies
  const totalCash = cashSummaries.reduce((total, summary) => {
    return total + Object.values(summary.totalsByCurrency).reduce((sum, amount) => sum + amount, 0);
  }, 0);

  // Calculate alerts (agencies with critical or low status)
  const alerts = cashSummaries.reduce((count, summary) => {
    const hasAlerts = summary.tills.some(till => 
      till.balances.some(balance => balance.status === 'critical' || balance.status === 'low')
    ) || summary.vault.balances.some(balance => balance.status === 'critical' || balance.status === 'low');
    return hasAlerts ? count + 1 : count;
  }, 0);

  // Convert summaries to agency cash data format expected by the component
  const agencyCashData = cashSummaries.map(summary => ({
    id: summary.agencyId,
    name: summary.agencyName,
    status: summary.vault.balances.some(b => b.status === 'critical' || b.status === 'low') ? 'attention' : 'optimal',
    currencies: summary.vault.balances.map(balance => ({
      code: balance.currency,
      amount: balance.balance,
      status: balance.status === 'critical' || balance.status === 'low' ? 'attention' : 'optimal',
      minThreshold: balance.minThreshold,
      maxThreshold: balance.maxThreshold
    }))
  }));

  const handleCashTransfer = async (agencyId: string) => {
    setIsLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Gestion de trésorerie",
        description: `Traitement initié pour l'agence ${agencyId}`,
      });
    }, 1000);
  };

  const processCashTransfer = (agencyIndex: number, request: CashTransferRequest) => {
    const currentSummary = cashSummaries[agencyIndex];
    
    // Validation du transfert
    const validation = CashManagementService.validateCashTransfer(request);
    if (!validation.isValid) {
      toast({
        title: "Erreur de validation",
        description: validation.errors.join(", "),
        variant: "destructive"
      });
      return false;
    }

    // Traitement du transfert
    const result = CashManagementService.processCashTransfer(
      request,
      currentSummary.tills,
      currentSummary.vault
    );

    if (result.success && result.updatedTills && result.updatedVault) {
      // Mise à jour de la consolidation
      const updatedSummary = CashManagementService.consolidateAgencyCash(
        result.updatedTills,
        result.updatedVault
      );

      setCashSummaries(prev => prev.map((summary, index) => 
        index === agencyIndex ? updatedSummary : summary
      ));

      toast({
        title: "Transfert réussi",
        description: `${request.amount} ${request.currency} transféré avec succès`,
      });
      return true;
    } else {
      toast({
        title: "Erreur de transfert",
        description: result.error || "Erreur inconnue",
        variant: "destructive"
      });
      return false;
    }
  };

  const createNewCashierTill = (agencyIndex: number, cashierId: string, cashierName: string) => {
    const currentSummary = cashSummaries[agencyIndex];
    const newTill = CashManagementService.createCashierTill(
      cashierId,
      cashierName,
      currentSummary.agencyId
    );

    const updatedTills = [...currentSummary.tills, newTill];
    const updatedSummary = CashManagementService.consolidateAgencyCash(
      updatedTills,
      currentSummary.vault
    );

    setCashSummaries(prev => prev.map((summary, index) => 
      index === agencyIndex ? updatedSummary : summary
    ));

    toast({
      title: "Nouvelle caisse créée",
      description: `Caisse créée pour ${cashierName}`,
    });
  };

  return {
    cashSummaries,
    agencyCashData,
    handleCashTransfer,
    isLoading,
    totalCash,
    alerts,
    processCashTransfer,
    createNewCashierTill
  };
}
