
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionFilters, FilterState } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { Transaction } from "@/types/transaction";
import { mockTransactions } from "@/data/mockData";
import { Plus, Download, Upload } from "lucide-react";

export default function TransactionsPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    currency: "all",
    agency: "all",
    dateRange: undefined,
  });

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((transaction) => {
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
  }, [filters]);

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseDialog = () => {
    setSelectedTransaction(null);
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
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Nouvelle transaction
          </Button>
        </div>
      </div>

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
    </div>
  );
}
