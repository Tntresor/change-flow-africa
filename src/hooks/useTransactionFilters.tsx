
import { useState, useMemo } from "react";
import { Transaction } from "@/types/transaction";
import { FilterState } from "@/components/transactions/TransactionFilters";

export function useTransactionFilters(transactions: Transaction[]) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    type: "all",
    currency: "all",
    agency: "all",
    dateRange: undefined,
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Filtre de recherche
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          transaction.id.toLowerCase().includes(searchTerm) ||
          transaction.prefixId?.toLowerCase().includes(searchTerm) ||
          transaction.sender.name?.toLowerCase().includes(searchTerm) ||
          transaction.receiver.name?.toLowerCase().includes(searchTerm) ||
          transaction.amount.toString().includes(searchTerm) ||
          transaction.agencyName.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) return false;
      }

      // Filtre de statut
      if (filters.status !== "all" && transaction.status !== filters.status) {
        return false;
      }

      // Filtre de type
      if (filters.type !== "all" && transaction.type !== filters.type) {
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

  const hasActiveFilters = Boolean(
    filters.search || 
    filters.status !== "all" || 
    filters.type !== "all" || 
    filters.currency !== "all" || 
    filters.agency !== "all" || 
    filters.dateRange
  );

  return {
    filters,
    setFilters,
    filteredTransactions,
    hasActiveFilters
  };
}
