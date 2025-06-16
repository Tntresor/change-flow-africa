
import { CommissionTierSettings } from "@/types/rates";

export interface CommissionCalculation {
  amount: number;
  percentage: number;
  tier: CommissionTierSettings;
  totalCommission: number;
}

export class CommissionService {
  static calculateCommission(
    amount: number,
    commissions: CommissionTierSettings[],
    transactionType: string = "currency_exchange"
  ): CommissionCalculation {
    // Filtrer les commissions actives pour le type de transaction
    const applicableCommissions = commissions.filter(
      c => c.isActive && 
          (c.transactionType === transactionType || c.transactionType === "all")
    );

    // Trouver la commission appropriée basée sur le montant
    const commission = this.findApplicableCommission(amount, applicableCommissions);
    
    if (!commission) {
      return {
        amount: 0,
        percentage: 0,
        tier: this.createDefaultTier(),
        totalCommission: 0
      };
    }

    const calculatedCommission = this.calculateCommissionAmount(amount, commission);

    return {
      amount: calculatedCommission,
      percentage: commission.percentage,
      tier: commission,
      totalCommission: calculatedCommission
    };
  }

  private static findApplicableCommission(
    amount: number,
    commissions: CommissionTierSettings[]
  ): CommissionTierSettings | null {
    // Trier par ordre croissant
    const sortedCommissions = commissions.sort((a, b) => a.order - b.order);
    
    for (const commission of sortedCommissions) {
      if (amount >= commission.minAmount && 
          (!commission.maxAmount || amount <= commission.maxAmount)) {
        return commission;
      }
    }

    return null;
  }

  private static calculateCommissionAmount(
    amount: number,
    commission: CommissionTierSettings
  ): number {
    switch (commission.type) {
      case 'percentage':
        return (amount * commission.percentage) / 100;
      
      case 'fixed':
        return commission.fixedAmount;
      
      case 'percentage_plus_fixed':
        return (amount * commission.percentage) / 100 + commission.fixedAmount;
      
      case 'percentage_with_minimum':
        const percentageAmount = (amount * commission.percentage) / 100;
        return Math.max(percentageAmount, commission.fixedAmount);
      
      default:
        return commission.fixedAmount;
    }
  }

  private static createDefaultTier(): CommissionTierSettings {
    return {
      id: "default",
      name: "Commission par défaut",
      minAmount: 0,
      fixedAmount: 0,
      percentage: 0,
      currency: "EUR",
      isActive: true,
      order: 0,
      type: 'fixed',
      value: 0,
      transactionType: "currency_exchange"
    };
  }
}
