import { describe, it, expect } from 'vitest';
import { ReconciliationService } from '../reconciliationService';
import { Transaction } from '@/types/transaction';
import { CashOperation } from '@/types/cashOperation';

describe('ReconciliationService', () => {
  const mockTransactions: Transaction[] = [
    {
      id: 'tx1',
      type: 'currency_exchange',
      amount: 100,
      fromCurrency: 'EUR',
      toCurrency: 'USD',
      exchangeRate: 1.085,
      spread: 0.02,
      finalRate: 1.065,
      convertedAmount: 108.5,
      fees: 2.50,
      commission: { 
        percentage: 1.5, 
        amount: 1.50,
        tier: {
          id: 'standard',
          name: 'Standard',
          minAmount: 0,
          maxAmount: 1000,
          fixedAmount: 1.50,
          percentage: 1.5
        },
        totalCommission: 1.50
      },
      status: 'completed',
      timestamp: new Date('2024-01-15T10:00:00'),
      agencyId: '1',
      agencyName: 'Agence Paris Centre',
      origin: {
        type: 'agency',
        id: '1',
        name: 'Agence Paris Centre',
        country: 'France'
      },
      destination: {
        type: 'agency',
        id: '1',
        name: 'Agence Paris Centre',
        country: 'France'
      },
      sender: {
        id: 'cust_1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      },
      receiver: {
        id: 'cust_2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+0987654321'
      },
      validationType: 'none',
      agent: { id: 'emp_1', name: 'Marie Dubois', role: 'agent' }
    }
  ];

  const mockCashOperations: CashOperation[] = [
    {
      id: 'cash1',
      type: 'cash_in',
      amount: 500,
      currency: 'EUR',
      reason: 'Réapprovisionnement',
      reference: 'CASH001',
      timestamp: new Date('2024-01-15T09:00:00'),
      agencyId: '1',
      agencyName: 'Agence Paris Centre'
    }
  ];

  describe('createReconciliationEntry', () => {
    it('should create a reconciliation entry with correct calculations', () => {
      const entry = ReconciliationService.createReconciliationEntry(
        'emp_1',
        'Marie Dubois',
        '1',
        'till_001',
        'EUR',
        mockTransactions,
        mockCashOperations,
        602.00 // actualCash
      );

      expect(entry.agentId).toBe('emp_1');
      expect(entry.agentName).toBe('Marie Dubois');
      expect(entry.currency).toBe('EUR');
      expect(entry.theoreticalBalance).toBe(397.50); // 500 (cash_in) - 102.50 (transaction)
      expect(entry.actualCash).toBe(602.00);
      expect(entry.variance).toBe(204.50); // 602 - 397.50
      expect(entry.status).toBe('variance_unresolved');
      expect(entry.transactions).toHaveLength(2); // 1 transaction + 1 cash operation
    });

    it('should mark entry as balanced when variance is minimal', () => {
      const entry = ReconciliationService.createReconciliationEntry(
        'emp_1',
        'Marie Dubois',
        '1',
        'till_001',
        'EUR',
        mockTransactions,
        mockCashOperations,
        397.50 // Exact theoretical balance
      );

      expect(entry.variance).toBe(0);
      expect(entry.status).toBe('balanced');
    });
  });

  describe('validateReconciliationData', () => {
    it('should validate correct reconciliation data', () => {
      const result = ReconciliationService.validateReconciliationData(
        'emp_1',
        'till_001',
        'EUR',
        500.00
      );

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject negative cash amount', () => {
      const result = ReconciliationService.validateReconciliationData(
        'emp_1',
        'till_001',
        'EUR',
        -100.00
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le montant cash ne peut pas être négatif');
    });

    it('should reject missing required fields', () => {
      const result = ReconciliationService.validateReconciliationData(
        '',
        '',
        '',
        500.00
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });

  describe('calculateReconciliationStats', () => {
    const mockEntries = [
      {
        id: 'rec_1',
        agentId: 'emp_1',
        agentName: 'Agent 1',
        agencyId: '1',
        date: new Date(),
        tillId: 'till_1',
        currency: 'EUR',
        theoreticalBalance: 100,
        actualCash: 100,
        variance: 0,
        transactions: [],
        status: 'balanced' as const
      },
      {
        id: 'rec_2',
        agentId: 'emp_2',
        agentName: 'Agent 2',
        agencyId: '1',
        date: new Date(),
        tillId: 'till_2',
        currency: 'EUR',
        theoreticalBalance: 200,
        actualCash: 205,
        variance: 5,
        transactions: [],
        status: 'variance_unresolved' as const
      }
    ];

    it('should calculate correct statistics', () => {
      const stats = ReconciliationService.calculateReconciliationStats(mockEntries);

      expect(stats.totalEntries).toBe(2);
      expect(stats.balancedEntries).toBe(1);
      expect(stats.varianceEntries).toBe(1);
      expect(stats.averageVariance).toBe(2.5); // (0 + 5) / 2
      expect(stats.maxVariance).toBe(5);
    });
  });
});
