
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { AddTransactionForm } from "@/components/transactions/AddTransactionForm";
import { TransactionPageHeader } from "@/components/transactions/TransactionPageHeader";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { CriticalTransactionsSection } from "@/components/transactions/CriticalTransactionsSection";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { Transaction } from "@/types/transaction";
import { mockTransactions } from "@/data/mockData";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { 
    filters, 
    setFilters, 
    filteredTransactions, 
    hasActiveFilters 
  } = useTransactionFilters(transactions);

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
      <TransactionPageHeader
        transactionCount={filteredTransactions.length}
        hasFilters={hasActiveFilters}
        onAddTransaction={() => setShowAddForm(true)}
      />

      {/* Section Transactions Critiques */}
      <CriticalTransactionsSection
        transactions={transactions}
        onViewTransaction={handleViewTransaction}
      />

      {/* Statistiques rapides */}
      <TransactionStats transactions={filteredTransactions} />

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
