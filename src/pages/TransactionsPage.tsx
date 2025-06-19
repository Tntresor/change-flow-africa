
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionPageLayout } from "@/components/transactions/TransactionPageLayout";
import { TransactionCancellationTest } from "@/components/test/TransactionCancellationTest";
import { MakerCheckerTest } from "@/components/test/MakerCheckerTest";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { useTransactionState } from "@/hooks/useTransactionState";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";

export default function TransactionsPage() {
  const {
    transactions,
    selectedTransaction,
    showAddForm,
    handleViewTransaction,
    handleCloseDetailDialog,
    handleAddTransaction,
    handleCloseAddForm,
    handleOpenAddForm,
  } = useTransactionState();

  const { filters, setFilters, filteredTransactions, hasActiveFilters } = useTransactionFilters(transactions);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600 mt-2">
          Gestion des transactions, approbations et annulations
        </p>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="maker-checker" className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Maker-Checker
            <Badge variant="secondary" className="text-xs">Beta</Badge>
          </TabsTrigger>
          <TabsTrigger value="cancellation" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Annulations
            <Badge variant="secondary" className="text-xs">Beta</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <TransactionPageLayout 
            transactions={transactions}
            filteredTransactions={filteredTransactions}
            hasActiveFilters={hasActiveFilters}
            onAddTransaction={handleOpenAddForm}
            onViewTransaction={handleViewTransaction}
            onFiltersChange={setFilters}
          />
        </TabsContent>

        <TabsContent value="maker-checker">
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Système Maker-Checker</h2>
              <p className="text-gray-600">
                Validation et approbation des transactions dépassant les limites définies
              </p>
            </div>
            <MakerCheckerTest />
          </Card>
        </TabsContent>

        <TabsContent value="cancellation">
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibent mb-2">Annulation de transactions</h2>
              <p className="text-gray-600">
                Annulation sécurisée des transactions avec validation des permissions
              </p>
            </div>
            <TransactionCancellationTest />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
