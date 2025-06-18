
import { useState } from "react";
import { mockAgencyCashSummaries } from "@/data/mockCashManagementData";
import { CashManagementService } from "@/features/cash-management/services/cashManagementService";
import { CashTransferRequest, AgencyCashSummary } from "@/types/cashManagement";
import { useToast } from "@/hooks/use-toast";

export function useCashManagementTest() {
  const [cashSummaries, setCashSummaries] = useState<AgencyCashSummary[]>(mockAgencyCashSummaries);
  const { toast } = useToast();

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
    processCashTransfer,
    createNewCashierTill
  };
}
