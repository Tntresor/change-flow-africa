import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TransactionFilters, FilterState } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { AddTransactionForm } from "@/components/transactions/AddTransactionForm";
import { Transaction } from "@/types/transaction";
import { mockTransactions } from "@/data/mockData";
import { Plus, Download, Upload, WifiOff, Clock, AlertTriangle } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    currency: "all",
    agency: "all",
    dateRange: undefined,
  });

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Filtre de recherche
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          transaction.id.toLowerCase().includes(searchTerm) ||
          transaction.prefixId?.toLowerCase().includes(searchTerm) ||
          transaction.customerName?.toLowerCase().includes(searchTerm) ||
          transaction.amount.toString().includes(searchTerm) ||
          transaction.agencyName.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) return false;
      }

      // Filtre de statut
      if (filters.status !== "all" && transaction.status !== filters.status) {
        return false;
      }

      // Filtre de devise
      if (filters.currency !== "all" && 
          transaction.fromCurrency !== filters.currency && 
          transaction.toCurrency !== filters.currency) {
        return false;
      }

      // Filtre d'agence
      if (filters.agency !== "all") {
        const agencyMatch = transaction.agencyName.toLowerCase().includes(filters.agency);
        if (!agencyMatch) return false;
      }

      // Filtre de date
      if (filters.dateRange?.from) {
        const transactionDate = new Date(transaction.timestamp);
        const fromDate = new Date(filters.dateRange.from);
        
        if (transactionDate < fromDate) return false;
        
        if (filters.dateRange.to) {
          const toDate = new Date(filters.dateRange.to);
          if (transactionDate > toDate) return false;
        }
      }

      return true;
    });
  }, [filters, transactions]);

  // Transactions qui nécessitent une attention particulière
  const offlineTransactions = transactions.filter(t => t.status === 'offline' || t.isOffline);
  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const criticalTransactions = [...offlineTransactions, ...pendingTransactions];

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseDialog = () => {
    setSelectedTransaction(null);
  };

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions([newTransaction, ...transactions]);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} 
            {filters.search || filters.status !== "all" || filters.currency !== "all" || 
             filters.agency !== "all" || filters.dateRange ? ' (filtrées)' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Importer
          </Button>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Nouvelle transaction
          </Button>
        </div>
      </div>

      {/* Section Transactions Critiques */}
      {criticalTransactions.length > 0 && (
        <Card className="p-6 border-orange-200 bg-orange-50">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-orange-900">Transactions nécessitant une attention</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Transactions Hors Ligne */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <WifiOff className="w-4 h-4 text-gray-600" />
                <h3 className="font-medium text-gray-900">Transactions Hors Ligne</h3>
                <Badge variant="secondary" className="ml-auto">
                  {offlineTransactions.length}
                </Badge>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {offlineTransactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <span className="font-mono">{transaction.prefixId}</span>
                    <span className="text-gray-600">{transaction.agencyName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewTransaction(transaction)}
                      className="h-6 px-2 text-xs"
                    >
                      Voir
                    </Button>
                  </div>
                ))}
                {offlineTransactions.length > 3 && (
                  <p className="text-xs text-gray-500 text-center pt-2">
                    +{offlineTransactions.length - 3} autres transactions
                  </p>
                )}
              </div>
            </div>

            {/* Transactions En Attente */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-orange-600" />
                <h3 className="font-medium text-gray-900">Transactions En Attente</h3>
                <Badge variant="secondary" className="ml-auto">
                  {pendingTransactions.length}
                </Badge>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {pendingTransactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <span className="font-mono">{transaction.prefixId}</span>
                    <span className="text-gray-600">{transaction.agencyName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewTransaction(transaction)}
                      className="h-6 px-2 text-xs"
                    >
                      Voir
                    </Button>
                  </div>
                ))}
                {pendingTransactions.length > 3 && (
                  <p className="text-xs text-gray-500 text-center pt-2">
                    +{pendingTransactions.length - 3} autres transactions
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Total transactions</div>
          <div className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Terminées</div>
          <div className="text-2xl font-bold text-green-600">
            {filteredTransactions.filter(t => t.status === 'completed').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">En attente</div>
          <div className="text-2xl font-bold text-orange-600">
            {filteredTransactions.filter(t => t.status === 'pending').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Volume total</div>
          <div className="text-2xl font-bold text-gray-900">
            {filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}€
          </div>
        </div>
      </div>

      {/* Filtres */}
      <TransactionFilters onFiltersChange={setFilters} />

      {/* Tableau des transactions */}
      <TransactionTable 
        transactions={filteredTransactions}
        onViewTransaction={handleViewTransaction}
      />

      {/* Dialog de détail de transaction */}
      <Dialog open={!!selectedTransaction} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Détail de la transaction {selectedTransaction?.prefixId || selectedTransaction?.id.slice(0, 8)}
            </DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="p-4">
              <TransactionCard transaction={selectedTransaction} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de création de transaction */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <AddTransactionForm
            onSuccess={handleAddTransaction}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
