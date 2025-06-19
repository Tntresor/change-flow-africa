
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LedgerService } from "@/services/ledgerService";
import { mockTransactions } from "@/data/mockData";
import { useState } from "react";
import { Transaction } from "@/types/transaction";
import { LedgerEntry, AgencyLedger } from "@/types/ledger";
import { FileText, TrendingUp, TrendingDown } from "lucide-react";

export function LedgerTest() {
  const [selectedTransactionId, setSelectedTransactionId] = useState("");
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [agencyLedgers, setAgencyLedgers] = useState<AgencyLedger[]>([]);

  const completedTransactions = mockTransactions.filter(t => t.status === 'completed').slice(0, 5);
  const selectedTransaction = completedTransactions.find(t => t.id === selectedTransactionId);

  const handleCreateLedgerEntries = () => {
    if (!selectedTransaction) return;

    const entries = LedgerService.createLedgerEntriesFromTransaction(selectedTransaction);
    setLedgerEntries(prev => [...prev, ...entries]);
    
    console.log("Écritures comptables créées:", entries);
  };

  const handleCreateReversalEntries = () => {
    if (!selectedTransaction) return;

    const originalEntries = ledgerEntries.filter(
      entry => entry.transactionId === selectedTransaction.id && !entry.isReversalEntry
    );

    if (originalEntries.length === 0) {
      console.log("Aucune écriture originale trouvée pour cette transaction");
      return;
    }

    const reversalEntries = LedgerService.createReversalEntries(
      originalEntries, 
      `reversal_${selectedTransaction.id}`
    );
    
    setLedgerEntries(prev => [...prev, ...reversalEntries]);
    console.log("Écritures d'annulation créées:", reversalEntries);
  };

  const handleCalculateAgencyBalance = () => {
    const currencies = ['EUR', 'XOF', 'USD', 'MAD'];
    const agencies = ['1', '2', '3'];

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

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'asset': return 'bg-blue-100 text-blue-800';
      case 'liability': return 'bg-red-100 text-red-800';
      case 'revenue': return 'bg-green-100 text-green-800';
      case 'expense': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Test du Micro-Ledger</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Transaction à traiter</label>
          <Select value={selectedTransactionId} onValueChange={setSelectedTransactionId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une transaction" />
            </SelectTrigger>
            <SelectContent>
              {completedTransactions.map((transaction) => (
                <SelectItem key={transaction.id} value={transaction.id}>
                  {transaction.prefixId} - {transaction.amount} {transaction.fromCurrency} 
                  → {transaction.convertedAmount} {transaction.toCurrency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTransaction && (
          <Card className="p-4 mb-4 bg-gray-50">
            <h4 className="font-medium mb-2">Transaction sélectionnée</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div><strong>Type:</strong> {selectedTransaction.type}</div>
              <div><strong>Montant:</strong> {selectedTransaction.amount} {selectedTransaction.fromCurrency}</div>
              <div><strong>Converti:</strong> {selectedTransaction.convertedAmount} {selectedTransaction.toCurrency}</div>
              <div><strong>Commission:</strong> {selectedTransaction.commission?.totalCommission || 0} {selectedTransaction.fromCurrency}</div>
              <div><strong>Frais:</strong> {selectedTransaction.fees} {selectedTransaction.fromCurrency}</div>
              <div><strong>Agence:</strong> {selectedTransaction.agencyName}</div>
            </div>
          </Card>
        )}
        
        <div className="flex gap-2 mb-6">
          <Button 
            onClick={handleCreateLedgerEntries}
            disabled={!selectedTransaction}
          >
            Créer écritures comptables
          </Button>
          <Button 
            onClick={handleCreateReversalEntries}
            variant="outline"
            disabled={!selectedTransaction}
          >
            Créer écritures d'annulation
          </Button>
          <Button 
            onClick={handleCalculateAgencyBalance}
            variant="outline"
          >
            Calculer balances agences
          </Button>
          <Button 
            onClick={handleConsolidateLedgers}
            variant="outline"
          >
            Consolider
          </Button>
        </div>
      </Card>

      {ledgerEntries.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Écritures comptables ({ledgerEntries.length})</h3>
          
          <div className="space-y-3">
            {ledgerEntries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">{entry.accountName}</span>
                    <Badge className={getAccountTypeColor(entry.accountType)}>
                      {entry.accountType}
                    </Badge>
                    {entry.isReversalEntry && (
                      <Badge variant="destructive">ANNULATION</Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{entry.currency}</span>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <strong>Débit:</strong> 
                    <div className="flex items-center gap-1">
                      {entry.debitAmount > 0 && <TrendingUp className="w-3 h-3 text-green-500" />}
                      {formatAmount(entry.debitAmount, entry.currency)}
                    </div>
                  </div>
                  <div>
                    <strong>Crédit:</strong>
                    <div className="flex items-center gap-1">
                      {entry.creditAmount > 0 && <TrendingDown className="w-3 h-3 text-red-500" />}
                      {formatAmount(entry.creditAmount, entry.currency)}
                    </div>
                  </div>
                  <div>
                    <strong>Solde:</strong>
                    <span className={entry.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatAmount(entry.balance, entry.currency)}
                    </span>
                  </div>
                  <div>
                    <strong>Réf:</strong> {entry.reference}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-2">{entry.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {agencyLedgers.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Balances par agence</h3>
          
          <div className="space-y-4">
            {agencyLedgers.map((ledger) => (
              <div key={ledger.agencyId} className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">{ledger.agencyName}</h4>
                
                <div className="space-y-3">
                  {Object.entries(ledger.balancesByCurrency).map(([currency, balance]) => (
                    <div key={currency} className="bg-gray-50 p-3 rounded">
                      <h5 className="font-medium mb-2">{currency}</h5>
                      <div className="grid grid-cols-5 gap-2 text-sm">
                        <div>
                          <strong>Actifs:</strong><br />
                          <span className="text-green-600">
                            {formatAmount(balance.totalAssets, currency)}
                          </span>
                        </div>
                        <div>
                          <strong>Passifs:</strong><br />
                          <span className="text-red-600">
                            {formatAmount(balance.totalLiabilities, currency)}
                          </span>
                        </div>
                        <div>
                          <strong>Revenus:</strong><br />
                          <span className="text-green-600">
                            {formatAmount(balance.totalRevenue, currency)}
                          </span>
                        </div>
                        <div>
                          <strong>Charges:</strong><br />
                          <span className="text-red-600">
                            {formatAmount(balance.totalExpenses, currency)}
                          </span>
                        </div>
                        <div>
                          <strong>Position nette:</strong><br />
                          <span className={balance.netPosition >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {formatAmount(balance.netPosition, currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
