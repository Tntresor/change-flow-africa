
import { describe, it, expect } from 'vitest'
import { TransactionCalculationService } from '../transactionCalculationService'
import { ExchangeRateSettings, CommissionTierSettings, FeeSettings } from '@/types/rates'

describe('TransactionCalculationService', () => {
  const mockExchangeRates: ExchangeRateSettings[] = [
    {
      id: '1',
      fromCurrency: 'EUR',
      toCurrency: 'USD',
      baseRate: 1.0850,
      totalSpread: 0.0100,
      bidRate: 1.0800,
      askRate: 1.0900,
      isActive: true,
      lastUpdated: new Date(),
    }
  ]

  const mockCommissions: CommissionTierSettings[] = [
    {
      id: 'comm1',
      name: 'Standard',
      minAmount: 0,
      maxAmount: 1000,
      fixedAmount: 2.00,
      percentage: 1.0,
      currency: 'EUR',
      isActive: true,
      order: 1,
      type: 'percentage_plus_fixed',
      value: 1.0,
    }
  ]

  const mockFees: FeeSettings[] = [
    {
      id: '1',
      name: 'Processing Fee',
      amount: 2.50,
      currency: 'EUR',
      isActive: true,
    }
  ]

  describe('calculateTransaction', () => {
    it('should calculate transaction correctly with automatic rates', () => {
      const result = TransactionCalculationService.calculateTransaction(
        100, // amount
        'EUR',
        'USD',
        mockExchangeRates,
        mockCommissions,
        mockFees
      )

      expect(result.exchangeRate).toBe(1.0900) // Ask rate
      expect(result.commission).toBe(3.00) // (100 * 1%) + 2.00
      expect(result.fees).toBe(2.50)
      expect(result.convertedAmount).toBe(103.35) // (100 - 3 - 2.5) * 1.09
      expect(result.finalAmount).toBe(103.35)
    })

    it('should use manual overrides when provided', () => {
      const result = TransactionCalculationService.calculateTransaction(
        100,
        'EUR',
        'USD',
        mockExchangeRates,
        mockCommissions,
        mockFees,
        {
          rate: 1.1000,
          commission: 5.00,
          fees: 3.00
        }
      )

      expect(result.exchangeRate).toBe(1.1000)
      expect(result.commission).toBe(5.00)
      expect(result.fees).toBe(3.00)
      expect(result.convertedAmount).toBe(101.20) // (100 - 5 - 3) * 1.1
      expect(result.finalAmount).toBe(101.20)
    })

    it('should handle missing exchange rate gracefully', () => {
      const result = TransactionCalculationService.calculateTransaction(
        100,
        'EUR',
        'GBP', // No rate available
        mockExchangeRates,
        mockCommissions,
        mockFees
      )

      expect(result.exchangeRate).toBe(1) // Fallback to 1
      expect(result.convertedAmount).toBe(94.50) // (100 - 3 - 2.5) * 1
    })
  })
})
