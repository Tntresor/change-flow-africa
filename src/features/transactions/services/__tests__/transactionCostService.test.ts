
import { describe, it, expect } from 'vitest';
import { TransactionCostService } from '../transactionCostService';
import { ThirdPartyFeeSettings } from '@/types/transactionCost';

describe('TransactionCostService', () => {
  const mockThirdPartyFees: ThirdPartyFeeSettings[] = [
    {
      id: 'fee_1',
      name: 'Frais fixe standard',
      type: 'fixed',
      fixedAmount: 5.00,
      currency: 'EUR',
      isActive: true,
      transactionType: 'currency_exchange'
    },
    {
      id: 'fee_2', 
      name: 'Commission pourcentage',
      type: 'percentage',
      percentage: 0.5,
      currency: 'EUR',
      isActive: true,
      transactionType: 'currency_exchange'
    },
    {
      id: 'fee_3',
      name: 'Frais mixte',
      type: 'mixed',
      fixedAmount: 2.00,
      percentage: 0.2,
      currency: 'EUR',
      isActive: true,
      transactionType: 'currency_exchange'
    }
  ];

  describe('calculateTransactionCost', () => {
    it('should calculate cost with fixed fee only', () => {
      const fixedFeeOnly = [mockThirdPartyFees[0]];
      
      const result = TransactionCostService.calculateTransactionCost(
        1000, // amount
        'EUR',
        1.0850, // exchange rate
        fixedFeeOnly,
        'currency_exchange'
      );

      expect(result.thirdPartyCapital).toBe(1085.00); // 1000 * 1.0850
      expect(result.fixedFees).toBe(5.00);
      expect(result.variableFees).toBe(0);
      expect(result.totalThirdPartyCost).toBe(1090.00); // 1085 + 5
      expect(result.feeDetails).toHaveLength(1);
      expect(result.feeDetails[0].appliedAmount).toBe(5.00);
    });

    it('should calculate cost with percentage fee only', () => {
      const percentageFeeOnly = [mockThirdPartyFees[1]];
      
      const result = TransactionCostService.calculateTransactionCost(
        1000,
        'EUR', 
        1.0850,
        percentageFeeOnly,
        'currency_exchange'
      );

      expect(result.thirdPartyCapital).toBe(1085.00);
      expect(result.fixedFees).toBe(0);
      expect(result.variableFees).toBe(5.00); // 1000 * 0.5%
      expect(result.totalThirdPartyCost).toBe(1090.00);
      expect(result.feeDetails).toHaveLength(1);
      expect(result.feeDetails[0].appliedAmount).toBe(5.00);
    });

    it('should calculate cost with mixed fee', () => {
      const mixedFeeOnly = [mockThirdPartyFees[2]];
      
      const result = TransactionCostService.calculateTransactionCost(
        1000,
        'EUR',
        1.0850,
        mixedFeeOnly,
        'currency_exchange'
      );

      expect(result.thirdPartyCapital).toBe(1085.00);
      expect(result.fixedFees).toBe(2.00);
      expect(result.variableFees).toBe(2.00); // 1000 * 0.2%
      expect(result.totalThirdPartyCost).toBe(1089.00); // 1085 + 2 + 2
      expect(result.feeDetails).toHaveLength(1);
      expect(result.feeDetails[0].appliedAmount).toBe(4.00); // 2 + 2
    });

    it('should calculate cost with all fee types combined', () => {
      const result = TransactionCostService.calculateTransactionCost(
        1000,
        'EUR',
        1.0850,
        mockThirdPartyFees,
        'currency_exchange'
      );

      expect(result.thirdPartyCapital).toBe(1085.00);
      expect(result.fixedFees).toBe(7.00); // 5 + 2
      expect(result.variableFees).toBe(7.00); // 5 + 2
      expect(result.totalThirdPartyCost).toBe(1099.00); // 1085 + 7 + 7
      expect(result.feeDetails).toHaveLength(3);
    });

    it('should filter inactive fees', () => {
      const feesWithInactive = [
        ...mockThirdPartyFees,
        {
          id: 'fee_4',
          name: 'Frais inactif',
          type: 'fixed' as const,
          fixedAmount: 10.00,
          currency: 'EUR',
          isActive: false,
          transactionType: 'currency_exchange'
        }
      ];

      const result = TransactionCostService.calculateTransactionCost(
        1000,
        'EUR',
        1.0850,
        feesWithInactive,
        'currency_exchange'
      );

      // Le résultat devrait être identique à celui avec tous les frais actifs
      expect(result.totalThirdPartyCost).toBe(1099.00);
      expect(result.feeDetails).toHaveLength(3); // Seulement les frais actifs
    });

    it('should filter fees by transaction type', () => {
      const feesWithDifferentType = [
        ...mockThirdPartyFees,
        {
          id: 'fee_5',
          name: 'Frais pour transfert',
          type: 'fixed' as const,
          fixedAmount: 15.00,
          currency: 'EUR',
          isActive: true,
          transactionType: 'internal_transfer'
        }
      ];

      const result = TransactionCostService.calculateTransactionCost(
        1000,
        'EUR',
        1.0850,
        feesWithDifferentType,
        'currency_exchange'
      );

      // Le frais pour transfert ne devrait pas être inclus
      expect(result.totalThirdPartyCost).toBe(1099.00);
      expect(result.feeDetails).toHaveLength(3);
    });
  });

  describe('validateThirdPartyFee', () => {
    it('should validate correct fixed fee', () => {
      const fee = {
        name: 'Test Fee',
        type: 'fixed' as const,
        fixedAmount: 5.00,
        currency: 'EUR'
      };

      const result = TransactionCostService.validateThirdPartyFee(fee);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate correct percentage fee', () => {
      const fee = {
        name: 'Test Fee',
        type: 'percentage' as const,
        percentage: 1.5,
        currency: 'EUR'
      };

      const result = TransactionCostService.validateThirdPartyFee(fee);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate correct mixed fee', () => {
      const fee = {
        name: 'Test Fee',
        type: 'mixed' as const,
        fixedAmount: 2.00,
        percentage: 0.5,
        currency: 'EUR'
      };

      const result = TransactionCostService.validateThirdPartyFee(fee);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject fee without name', () => {
      const fee = {
        type: 'fixed' as const,
        fixedAmount: 5.00,
        currency: 'EUR'
      };

      const result = TransactionCostService.validateThirdPartyFee(fee);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le nom du frais est obligatoire');
    });

    it('should reject invalid percentage values', () => {
      const fee = {
        name: 'Test Fee',
        type: 'percentage' as const,
        percentage: 150, // > 100%
        currency: 'EUR'
      };

      const result = TransactionCostService.validateThirdPartyFee(fee);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le pourcentage doit être entre 0 et 100');
    });
  });
});
