
import { CashierTill, SafeVault, CashTransferRequest, AgencyCashSummary } from "@/types/cashManagement";
import { CurrencyBalance } from "@/types/liquidity";
import { updateCurrencyBalance } from "@/utils/liquidityUtils";

export class CashManagementService {
  /**
   * Consolide les liquidités d'une agence (caisses + coffre)
   */
  static consolidateAgencyCash(
    tills: CashierTill[],
    vault: SafeVault
  ): AgencyCashSummary {
    const totalsByurrency: { [currency: string]: number } = {};

    // Consolider les caisses
    tills.forEach(till => {
      till.balances.forEach(balance => {
        if (!totalsByurrency[balance.currency]) {
          totalsByurrency[balance.currency] = 0;
        }
        totalsByurrency[balance.currency] += balance.balance;
      });
    });

    // Ajouter le coffre
    vault.balances.forEach(balance => {
      if (!totalsByurrency[balance.currency]) {
        totalsByurrency[balance.currency] = 0;
      }
      totalsByurrency[balance.currency] += balance.balance;
    });

    return {
      agencyId: vault.agencyId,
      agencyName: vault.agencyName,
      totalsByurrency,
      tills,
      vault,
      lastConsolidation: new Date()
    };
  }

  /**
   * Effectue un transfert entre caisse et coffre
   */
  static processCashTransfer(
    request: CashTransferRequest,
    tills: CashierTill[],
    vault: SafeVault
  ): { success: boolean; error?: string; updatedTills?: CashierTill[]; updatedVault?: SafeVault } {
    try {
      // Validation du transfert
      if (request.amount <= 0) {
        return { success: false, error: "Le montant doit être positif" };
      }

      let updatedTills = [...tills];
      let updatedVault = { ...vault };

      // Traiter le débit
      if (request.fromType === 'till') {
        const tillIndex = updatedTills.findIndex(t => t.id === request.fromId);
        if (tillIndex === -1) {
          return { success: false, error: "Caisse source introuvable" };
        }

        const till = updatedTills[tillIndex];
        const balanceIndex = till.balances.findIndex(b => b.currency === request.currency);
        
        if (balanceIndex === -1 || till.balances[balanceIndex].availableAmount < request.amount) {
          return { success: false, error: "Solde insuffisant dans la caisse source" };
        }

        updatedTills[tillIndex] = {
          ...till,
          balances: till.balances.map((balance, idx) =>
            idx === balanceIndex 
              ? updateCurrencyBalance(balance, -request.amount)
              : balance
          ),
          lastActivity: new Date()
        };
      } else {
        // Débit du coffre
        const balanceIndex = updatedVault.balances.findIndex(b => b.currency === request.currency);
        
        if (balanceIndex === -1 || updatedVault.balances[balanceIndex].availableAmount < request.amount) {
          return { success: false, error: "Solde insuffisant dans le coffre" };
        }

        updatedVault = {
          ...updatedVault,
          balances: updatedVault.balances.map((balance, idx) =>
            idx === balanceIndex 
              ? updateCurrencyBalance(balance, -request.amount)
              : balance
          ),
          lastUpdated: new Date()
        };
      }

      // Traiter le crédit
      if (request.toType === 'till') {
        const tillIndex = updatedTills.findIndex(t => t.id === request.toId);
        if (tillIndex === -1) {
          return { success: false, error: "Caisse destination introuvable" };
        }

        const till = updatedTills[tillIndex];
        const balanceIndex = till.balances.findIndex(b => b.currency === request.currency);
        
        if (balanceIndex === -1) {
          // Créer une nouvelle balance si elle n'existe pas
          updatedTills[tillIndex] = {
            ...till,
            balances: [
              ...till.balances,
              {
                currency: request.currency,
                balance: request.amount,
                minThreshold: 0,
                maxThreshold: 50000, // Valeur par défaut
                status: 'normal',
                reservedAmount: 0,
                availableAmount: request.amount
              }
            ],
            lastActivity: new Date()
          };
        } else {
          updatedTills[tillIndex] = {
            ...till,
            balances: till.balances.map((balance, idx) =>
              idx === balanceIndex 
                ? updateCurrencyBalance(balance, request.amount)
                : balance
            ),
            lastActivity: new Date()
          };
        }
      } else {
        // Crédit au coffre
        const balanceIndex = updatedVault.balances.findIndex(b => b.currency === request.currency);
        
        if (balanceIndex === -1) {
          updatedVault = {
            ...updatedVault,
            balances: [
              ...updatedVault.balances,
              {
                currency: request.currency,
                balance: request.amount,
                minThreshold: 0,
                maxThreshold: 100000, // Valeur par défaut
                status: 'normal',
                reservedAmount: 0,
                availableAmount: request.amount
              }
            ],
            lastUpdated: new Date()
          };
        } else {
          updatedVault = {
            ...updatedVault,
            balances: updatedVault.balances.map((balance, idx) =>
              idx === balanceIndex 
                ? updateCurrencyBalance(balance, request.amount)
                : balance
            ),
            lastUpdated: new Date()
          };
        }
      }

      return {
        success: true,
        updatedTills,
        updatedVault
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur lors du transfert"
      };
    }
  }

  /**
   * Crée une nouvelle caisse pour un caissier
   */
  static createCashierTill(
    cashierId: string,
    cashierName: string,
    agencyId: string,
    initialBalances: CurrencyBalance[] = []
  ): CashierTill {
    return {
      id: `till_${cashierId}_${Date.now()}`,
      cashierId,
      cashierName,
      agencyId,
      balances: initialBalances,
      isActive: true,
      lastActivity: new Date()
    };
  }

  /**
   * Valide les paramètres d'un transfert de caisse
   */
  static validateCashTransfer(request: CashTransferRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.fromId) {
      errors.push("L'identifiant source est obligatoire");
    }

    if (!request.toId) {
      errors.push("L'identifiant destination est obligatoire");
    }

    if (request.fromId === request.toId && request.fromType === request.toType) {
      errors.push("La source et la destination ne peuvent pas être identiques");
    }

    if (!request.currency) {
      errors.push("La devise est obligatoire");
    }

    if (!request.amount || request.amount <= 0) {
      errors.push("Le montant doit être supérieur à 0");
    }

    if (!request.reason) {
      errors.push("Le motif est obligatoire");
    }

    if (!request.initiatedBy) {
      errors.push("L'initiateur est obligatoire");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
