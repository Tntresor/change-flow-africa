
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

  describe('calculateTransaction with corrected bid/ask logic', () => {
    it('should calculate transaction correctly for SEND operations using bid rate', () => {
      const result = TransactionCalculationService.calculateTransaction(
        100, // amount
        'EUR',
        'USD',
        mockExchangeRates,
        mockCommissions,
        mockFees,
        { transferDirection: 'SEND' }
      )

      // Expected rate: 1.0800 * (1 - 0.005) = 1.0746
      expect(result.exchangeRate).toBe(1.0746)
      expect(result.transferDirection).toBe('SEND')
      expect(result.marginApplied).toBe(0.005)
      expect(result.commission.totalCommission).toBe(3.00) // (100 * 1%) + 2.00
      expect(result.fees.totalFees).toBe(2.50)
      expect(result.totalCost).toBe(5.50) // 3.00 + 2.50
      expect(result.netAmount).toBe(94.50) // 100 - 5.50
      expect(result.finalAmount).toBe(101.5497) // 94.50 * 1.0746
    })

    it('should calculate transaction correctly for RECEIVE operations using ask rate', () => {
      const result = TransactionCalculationService.calculateTransaction(
        100, // amount
        'EUR',
        'USD',
        mockExchangeRates,
        mockCommissions,
        mockFees,
        { transferDirection: 'RECEIVE' }
      )

      // Expected rate: 1.0900 * (1 + 0.005) = 1.09545
      expect(result.exchangeRate).toBe(1.09545)
      expect(result.transferDirection).toBe('RECEIVE')
      expect(result.marginApplied).toBe(0.005)
      expect(result.commission.totalCommission).toBe(3.00)
      expect(result.fees.totalFees).toBe(2.50)
      expect(result.totalCost).toBe(5.50)
      expect(result.netAmount).toBe(94.50)
      expect(result.finalAmount).toBe(103.520025) // 94.50 * 1.09545
    })

    it('should default to SEND direction for backward compatibility', () => {
      const result = TransactionCalculationService.calculateTransaction(
        100,
        'EUR',
        'USD',
        mockExchangeRates,
        mockCommissions,
        mockFees
      )

      expect(result.transferDirection).toBe('SEND')
      expect(result.exchangeRate).toBe(1.0746) // Bid rate with sell margin
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
          fees: 3.00,
          transferDirection: 'RECEIVE'
        }
      )

      expect(result.exchangeRate).toBe(1.1000)
      expect(result.transferDirection).toBe('RECEIVE')
      expect(result.marginApplied).toBeUndefined() // Manual rate overrides margin
      expect(result.commission.totalCommission).toBe(5.00)
      expect(result.fees.totalFees).toBe(3.00)
      expect(result.totalCost).toBe(8.00)
      expect(result.netAmount).toBe(92.00)
      expect(result.finalAmount).toBe(101.20) // 92.00 * 1.1
    })

    it('should handle missing exchange rate gracefully', () => {
      const result = TransactionCalculationService.calculateTransaction(
        100,
        'EUR',
        'GBP', // No rate available
        mockExchangeRates,
        mockCommissions,
        mockFees,
        { transferDirection: 'SEND' }
      )

      expect(result.exchangeRate).toBe(0) // Fallback to 0
      expect(result.totalCost).toBe(5.50)
      expect(result.netAmount).toBe(94.50)
      expect(result.finalAmount).toBe(0) // 94.50 * 0
    })
  })
})
