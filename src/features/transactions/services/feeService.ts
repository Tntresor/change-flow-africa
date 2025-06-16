
import { FeeSettings } from "@/types/rates";

export interface FeeCalculation {
  fees: FeeSettings[];
  totalFees: number;
}

export class FeeService {
  static calculateFees(
    fees: FeeSettings[],
    transactionType: string = "currency_exchange"
  ): FeeCalculation {
    // Filtrer les frais actifs pour le type de transaction
    const applicableFees = fees.filter(
      fee => fee.isActive && 
             (fee.transactionType === transactionType || 
              fee.transactionType === "all" || 
              !fee.transactionType)
    );

    const totalFees = applicableFees.reduce((sum, fee) => sum + fee.amount, 0);

    return {
      fees: applicableFees,
      totalFees
    };
  }

  static getFeesByType(
    fees: FeeSettings[],
    transactionType: string
  ): FeeSettings[] {
    return fees.filter(
      fee => fee.isActive && 
             (fee.transactionType === transactionType || 
              fee.transactionType === "all" || 
              !fee.transactionType)
    );
  }

  static calculateTotalFees(fees: FeeSettings[]): number {
    return fees.reduce((sum, fee) => sum + fee.amount, 0);
  }
}
