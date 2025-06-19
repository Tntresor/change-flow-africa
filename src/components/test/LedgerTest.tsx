
import { Card } from "@/components/ui/card";
import { LedgerService } from "@/services/ledgerService";
import { mockTransactions } from "@/data/mockData";
import { useState } from "react";
import { Transaction } from "@/types/transaction";
import { LedgerEntry, AgencyLedger } from "@/types/ledger";
import { LedgerTransactionSelector } from "./ledger/LedgerTransactionSelector";
import { LedgerActions } from "./ledger/LedgerActions";
import { LedgerEntriesDisplay } from "./ledger/LedgerEntriesDisplay";
import { AgencyBalancesDisplay } from "./ledger/AgencyBalancesDisplay";

export function LedgerTest() {
  const [selectedTransactionId, setSelectedTransactionId] = useState("");
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [agencyLedgers, setAgencyLedgers] = useState<AgencyLedger[]>([]);

  const completedTransactions = mockTransactions.filter(t => t.status === 'completed').slice(0, 5);
  const selectedTransaction = completedTransactions.find(t => t.id === selectedTransactionId);

  const handleCreateLedgerEntries = () => {
    if (!selectedTransaction) {
      console.log("Aucune transaction sélectionnée");
      return;
    }

    const entries = LedgerService.createLedgerEntriesFromTransaction(selectedTransaction);
    setLedgerEntries(prev => [...prev, ...entries]);
    
    console.log("Écritures comptables créées:", entries);
  };

  const handleCreateReversalEntries = () => {
    if (!selectedTransaction) {
      console.log("Aucune transaction sélectionnée");
      return;
    }

    const originalEntries = ledgerEntries.filter(
      entry => entry.transactionId === selectedTransaction.id && !entry.isReversalEntry
    );

    if (originalEntries.length === 0) {
      console.log("Aucune écriture originale trouvée pour cette transaction");
      return;
    }

    const reversalEntries = LedgerService.createReversalEntries(
      originalEntries, 
      `reversal_${selectedTransaction.id}_${Date.now()}`
    );
    
    setLedgerEntries(prev => [...prev, ...reversalEntries]);
    console.log("Écritures d'annulation créées:", reversalEntries);
  };

  const handleCalculateAgencyBalance = () => {
    if (ledgerEntries.length === 0) {
      console.log("Aucune écriture comptable disponible pour calculer les balances");
      return;
    }

    const currencies = ['EUR', 'XOF', 'USD', 'MAD'];
    const agencies = Array.from(new Set(ledgerEntries.map(entry => entry.agencyId)));

    const newAgencyLedgers: AgencyLedger[] = agencies.map(agencyId => {
      const agencyEntries = ledgerEntries.filter(entry => entry.agencyId === agencyId);
      const agencyName = agencyEntries[0]?.agencyName || `Agence ${agencyId}`;
      
      const balancesByCurrency: Record<string, any> = {};
      
      currencies.forEach(currency => {
        const balance = LedgerService.calculateAgencyBalance(agencyEntries, currency);
        if (balance.totalAssets !== 0 || balance.totalLiabilities !== 0 || 
            balance.totalRevenue !== 0 || balance.totalExpenses !== 0) {
          balancesByCurrency[currency] = balance;
        }
      });

      return {
        agencyId,
        agencyName,
        entries: agencyEntries,
        balancesByCurrency,
        lastUpdated: new Date()
      };
    }).filter(ledger => Object.keys(ledger.balancesByCurrency).length > 0);

    setAgencyLedgers(newAgencyLedgers);
    console.log("Balances par agence calculées:", newAgencyLedgers);
  };

  const handleConsolidateLedgers = () => {
    if (agencyLedgers.length === 0) {
      console.log("Aucune balance d'agence à consolider");
      return;
    }

    const consolidated = LedgerService.consolidateLedgers(agencyLedgers);
    console.log("Consolidation des comptes:", consolidated);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Test du Micro-Ledger</h3>
        
        <LedgerTransactionSelector
          transactions={completedTransactions}
          selectedTransactionId={selectedTransactionId}
          onTransactionSelect={setSelectedTransactionId}
          selectedTransaction={selectedTransaction}
        />
        
        <LedgerActions
          onCreateEntries={handleCreateLedgerEntries}
          onCreateReversalEntries={handleCreateReversalEntries}
          onCalculateBalances={handleCalculateAgencyBalance}
          onConsolidate={handleConsolidateLedgers}
          hasSelectedTransaction={!!selectedTransaction}
          hasEntries={ledgerEntries.length > 0}
          hasBalances={agencyLedgers.length > 0}
        />

        <div className="text-sm text-gray-600 space-y-1">
          <p>Écritures comptables : {ledgerEntries.length}</p>
          <p>Balances calculées : {agencyLedgers.length} agences</p>
        </div>
      </Card>

      <LedgerEntriesDisplay entries={ledgerEntries} />
      <AgencyBalancesDisplay agencyLedgers={agencyLedgers} />
    </div>
  );
}
