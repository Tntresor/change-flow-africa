
import { ThirdPartyFeeSettings, TransactionCostBreakdown, ThirdPartyFeeDetails } from "@/types/transactionCost";

export class TransactionCostService {
  /**
   * Calcule le coût complet d'une transaction incluant capital tiers et frais
   */
  static calculateTransactionCost(
    amount: number,
    currency: string,
    exchangeRate: number,
    thirdPartyFees: ThirdPartyFeeSettings[],
    transactionType: string = "currency_exchange"
  ): TransactionCostBreakdown {
    // Capital tiers utilisé (montant converti)
    const thirdPartyCapital = amount * exchangeRate;
    
    // Calculer les frais tiers applicables
    const applicableFees = thirdPartyFees.filter(fee => 
      fee.isActive && 
      (!fee.transactionType || fee.transactionType === transactionType) &&
      fee.currency === currency
    );

    let fixedFees = 0;
    let variableFees = 0;
    const feeDetails: ThirdPartyFeeDetails[] = [];

    applicableFees.forEach(fee => {
      let appliedAmount = 0;
      let calculationBase = amount;

      switch (fee.type) {
        case 'fixed':
          appliedAmount = fee.fixedAmount || 0;
          fixedFees += appliedAmount;
          break;

        case 'percentage':
          appliedAmount = (amount * (fee.percentage || 0)) / 100;
          variableFees += appliedAmount;
          break;

        case 'mixed':
          const fixedPart = fee.fixedAmount || 0;
          const percentagePart = (amount * (fee.percentage || 0)) / 100;
          appliedAmount = fixedPart + percentagePart;
          fixedFees += fixedPart;
          variableFees += percentagePart;
          calculationBase = amount;
          break;
      }

      feeDetails.push({
        feeId: fee.id,
        feeName: fee.name,
        type: fee.type,
        appliedAmount: Math.round(appliedAmount * 100) / 100,
        calculationBase: fee.type !== 'fixed' ? calculationBase : undefined
      });
    });

    const totalThirdPartyCost = thirdPartyCapital + fixedFees + variableFees;

    return {
      thirdPartyCapital: Math.round(thirdPartyCapital * 100) / 100,
      fixedFees: Math.round(fixedFees * 100) / 100,
      variableFees: Math.round(variableFees * 100) / 100,
      totalThirdPartyCost: Math.round(totalThirdPartyCost * 100) / 100,
      feeDetails
    };
  }

  /**
   * Valide les paramètres de frais tiers
   */
  static validateThirdPartyFee(fee: Partial<ThirdPartyFeeSettings>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!fee.name) {
      errors.push("Le nom du frais est obligatoire");
    }

    if (!fee.type) {
      errors.push("Le type de frais est obligatoire");
    }

    if (fee.type === 'fixed' && (!fee.fixedAmount || fee.fixedAmount <= 0)) {
      errors.push("Le montant fixe doit être supérieur à 0");
    }

    if (fee.type === 'percentage' && (!fee.percentage || fee.percentage <= 0 || fee.percentage > 100)) {
      errors.push("Le pourcentage doit être entre 0 et 100");
    }

    if (fee.type === 'mixed' && (
      (!fee.fixedAmount || fee.fixedAmount <= 0) ||
      (!fee.percentage || fee.percentage <= 0 || fee.percentage > 100)
    )) {
      errors.push("Les montants fixe et pourcentage doivent être valides pour un frais mixte");
    }

    if (!fee.currency) {
      errors.push("La devise est obligatoire");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Crée un frais tiers par défaut
   */
  static createDefaultThirdPartyFee(): Partial<ThirdPartyFeeSettings> {
    return {
      name: "",
      type: "fixed",
      fixedAmount: 0,
      percentage: 0,
      currency: "EUR",
      isActive: true,
      transactionType: "currency_exchange"
    };
  }
}
