
import { useState, useCallback } from 'react';
import { mockTransactions, mockCustomers } from '@/data/mockData';
import { Customer } from '@/types/customer';
import { Transaction } from '@/types/transaction';

export function useCustomers() {
    const [transactions] = useState<Transaction[]>(mockTransactions);
    const [customers] = useState<Customer[]>(() => {
        const customerMap = new Map<string, Customer>(mockCustomers.map(c => [c.id, {...c}]));

        transactions.forEach(tx => {
            const customerInvolvedIds = [tx.sender.id, tx.receiver.id].filter(Boolean) as string[];
            
            customerInvolvedIds.forEach(id => {
                const customer = customerMap.get(id);
                if (customer) {
                    if (!customer.lastTransactionDate || tx.timestamp > customer.lastTransactionDate) {
                       customer.lastTransactionDate = tx.timestamp;
                       customerMap.set(id, customer);
                    }
                }
            });
        });

        return Array.from(customerMap.values()).sort((a, b) => 
            (b.lastTransactionDate?.getTime() || 0) - (a.lastTransactionDate?.getTime() || 0)
        );
    });
    
    const getCustomerById = useCallback((id: string) => {
        return customers.find(c => c.id === id);
    }, [customers]);

    const getTransactionsByCustomerId = useCallback((customerId: string) => {
        return transactions.filter(tx => tx.sender.id === customerId || tx.receiver.id === customerId)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [transactions]);

    return { customers, getCustomerById, getTransactionsByCustomerId };
}
