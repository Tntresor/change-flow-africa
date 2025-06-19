
import { Transaction } from "@/types/transaction";
import { LedgerEntry, AgencyLedger, ConsolidatedLedger, LedgerAccount, AgencyBalance } from "@/types/ledger";

// Comptes comptables de base
const LEDGER_ACCOUNTS: LedgerAccount[] = [
  { code: '110', name: 'Caisse', type: 'asset', isActive: true },
  { code: '120', name: 'Clients', type: 'asset', isActive: true },
  { code: '210', name: 'Fournisseurs', type: 'liability', isActive: true },
  { code: '310', name: 'Commissions reçues', type: 'revenue', isActive: true },
  { code: '320', name: 'Gains de change', type: 'revenue', isActive: true },
  { code: '410', name: 'Frais opérationnels', type: 'expense', isActive: true },
  { code: '420', name: 'Pertes de change', type: 'expense', isActive: true }
];

export class LedgerService {
  static createLedgerEntriesFromTransaction(transaction: Transaction): LedgerEntry[] {
    const entries: LedgerEntry[] = [];
    const baseId = `ledger_${transaction.id}`;
    const now = new Date();

    // Entrée 1: Débit Caisse (devise source) - Sortie d'argent
    entries.push({
      id: `${baseId}_1`,
      transactionId: transaction.id,
      agencyId: transaction.agencyId,
      agencyName: transaction.agencyName,
      entryDate: now,
      accountType: 'asset',
      accountCode: '110',
      accountName: `Caisse ${transaction.fromCurrency}`,
      currency: transaction.fromCurrency,
      debitAmount: 0,
      creditAmount: transaction.amount + transaction.fees,
      balance: -(transaction.amount + transaction.fees),
      description: `${transaction.type} - Sortie ${transaction.fromCurrency}`,
      reference: transaction.prefixId || transaction.id,
      isReversalEntry: false
    });

    // Entrée 2: Crédit Caisse (devise destination) - Entrée d'argent
    entries.push({
      id: `${baseId}_2`,
      transactionId: transaction.id,
      agencyId: transaction.agencyId,
      agencyName: transaction.agencyName,
      entryDate: now,
      accountType: 'asset',
      accountCode: '110',
      accountName: `Caisse ${transaction.toCurrency}`,
      currency: transaction.toCurrency,
      debitAmount: transaction.convertedAmount,
      creditAmount: 0,
      balance: transaction.convertedAmount,
      description: `${transaction.type} - Entrée ${transaction.toCurrency}`,
      reference: transaction.prefixId || transaction.id,
      isReversalEntry: false
    });

    // Entrée 3: Commissions reçues
    if (transaction.commission && transaction.commission.totalCommission > 0) {
      entries.push({
        id: `${baseId}_3`,
        transactionId: transaction.id,
        agencyId: transaction.agencyId,
        agencyName: transaction.agencyName,
        entryDate: now,
        accountType: 'revenue',
        accountCode: '310',
        accountName: 'Commissions reçues',
        currency: transaction.fromCurrency,
        debitAmount: transaction.commission.totalCommission,
        creditAmount: 0,
        balance: transaction.commission.totalCommission,
        description: `Commission sur ${transaction.type}`,
        reference: transaction.prefixId || transaction.id,
        isReversalEntry: false
      });
    }

    // Entrée 4: Frais opérationnels (si applicable)
    if (transaction.fees > 0) {
      entries.push({
        id: `${baseId}_4`,
        transactionId: transaction.id,
        agencyId: transaction.agencyId,
        agencyName: transaction.agencyName,
        entryDate: now,
        accountType: 'expense',
        accountCode: '410',
        accountName: 'Frais opérationnels',
        currency: transaction.fromCurrency,
        debitAmount: 0,
        creditAmount: transaction.fees,
        balance: -transaction.fees,
        description: `Frais sur ${transaction.type}`,
        reference: transaction.prefixId || transaction.id,
        isReversalEntry: false
      });
    }

    return entries;
  }

  static createReversalEntries(originalEntries: LedgerEntry[], reversalTransactionId: string): LedgerEntry[] {
    return originalEntries.map(entry => ({
      ...entry,
      id: `reversal_${entry.id}`,
      transactionId: reversalTransactionId,
      entryDate: new Date(),
      debitAmount: entry.creditAmount, // Inverser débit/crédit
      creditAmount: entry.debitAmount,
      balance: -entry.balance, // Inverser le solde
      description: `ANNULATION - ${entry.description}`,
      isReversalEntry: true,
      originalEntryId: entry.id
    }));
  }

  static calculateAgencyBalance(entries: LedgerEntry[], currency: string): AgencyBalance {
    const currencyEntries = entries.filter(e => e.currency === currency);
    
    const totalAssets = currencyEntries
      .filter(e => e.accountType === 'asset')
      .reduce((sum, e) => sum + e.balance, 0);
    
    const totalLiabilities = currencyEntries
      .filter(e => e.accountType === 'liability')
      .reduce((sum, e) => sum + e.balance, 0);
    
    const totalRevenue = currencyEntries
      .filter(e => e.accountType === 'revenue')
      .reduce((sum, e) => sum + e.balance, 0);
    
    const totalExpenses = currencyEntries
      .filter(e => e.accountType === 'expense')
      .reduce((sum, e) => sum + e.balance, 0);

    return {
      currency,
      totalAssets,
      totalLiabilities,
      totalRevenue,
      totalExpenses,
      netPosition: totalAssets - totalLiabilities + totalRevenue - totalExpenses
    };
  }

  static consolidateLedgers(agencyLedgers: AgencyLedger[]): ConsolidatedLedger {
    const consolidatedBalances: Record<string, AgencyBalance> = {};
    const totalNetPosition: Record<string, number> = {};

    // Obtenir toutes les devises utilisées
    const currencies = new Set<string>();
    agencyLedgers.forEach(ledger => {
      Object.keys(ledger.balancesByCurrency).forEach(currency => {
        currencies.add(currency);
      });
    });

    // Consolider par devise
    currencies.forEach(currency => {
      let totalAssets = 0;
      let totalLiabilities = 0;
      let totalRevenue = 0;
      let totalExpenses = 0;

      agencyLedgers.forEach(ledger => {
        const balance = ledger.balancesByCurrency[currency];
        if (balance) {
          totalAssets += balance.totalAssets;
          totalLiabilities += balance.totalLiabilities;
          totalRevenue += balance.totalRevenue;
          totalExpenses += balance.totalExpenses;
        }
      });

      consolidatedBalances[currency] = {
        currency,
        totalAssets,
        totalLiabilities,
        totalRevenue,
        totalExpenses,
        netPosition: totalAssets - totalLiabilities + totalRevenue - totalExpenses
      };

      totalNetPosition[currency] = consolidatedBalances[currency].netPosition;
    });

    return {
      companyName: "Koba Exchange",
      consolidationDate: new Date(),
      agencyLedgers,
      consolidatedBalances,
      totalNetPosition
    };
  }

  static getLedgerAccounts(): LedgerAccount[] {
    return LEDGER_ACCOUNTS.filter(account => account.isActive);
  }
}
