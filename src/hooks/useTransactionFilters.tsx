
import { useState, useMemo } from "react";
import { Transaction } from "@/types/transaction";
import { FilterState } from "@/components/transactions/TransactionFilters";
import { useAuth } from "@/hooks/useAuth";

export function useTransactionFilters(transactions: Transaction[]) {
  const { authState, canAccessAgency } = useAuth();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    type: "all",
    currency: "all",
    agency: "all",
    dateRange: undefined,
  });

  const filteredTransactions = useMemo(() => {
    console.log('🔄 Starting transaction filtering with:', {
      totalTransactions: transactions.length,
      currentUser: authState.user ? {
        name: `${authState.user.firstName} ${authState.user.lastName}`,
        role: authState.user.role,
        agencyId: authState.user.agencyId,
        agencyName: authState.user.agencyName
      } : null
    });

    let filtered = transactions;

    // Filtrer par agence selon les permissions de l'utilisateur
    if (authState.user) {
      console.log('🏢 Applying agency filtering...');
      
      const beforeAgencyFilter = filtered.length;
      filtered = filtered.filter(transaction => {
        const canAccess = canAccessAgency(transaction.agencyId);
        console.log('Transaction agency check:', {
          transactionId: transaction.id,
          transactionAgencyId: transaction.agencyId,
          transactionAgencyName: transaction.agencyName,
          canAccess
        });
        return canAccess;
      });
      
      console.log(`📊 Agency filter results: ${beforeAgencyFilter} → ${filtered.length} transactions`);
    }

    return filtered.filter((transaction) => {
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
  }, [filters, transactions, authState.user, canAccessAgency]);

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
