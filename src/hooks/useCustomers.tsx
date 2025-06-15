
import { useState, useMemo } from 'react';
import { mockTransactions } from '@/data/mockData';
import { CustomerInfo, Transaction } from '@/types/transaction';
import { Customer } from '@/types/customer';

const extractCustomersFromTransactions = (transactions: Transaction[]): Customer[] => {
    const customerMap = new Map<string, Customer>();

    transactions.forEach(tx => {
        const potentialCustomers: Partial<CustomerInfo>[] = [tx.sender, tx.receiver];
        if (tx.customerName) {
            potentialCustomers.push({ name: tx.customerName, phone: tx.customerPhone });
        }

        potentialCustomers.forEach(c => {
            if(c && c.name) {
                const key = c.phone || c.name;
                if (!customerMap.has(key)) {
                    customerMap.set(key, {
                        id: key,
                        name: c.name,
                        phone: c.phone,
                        email: c.email,
                        address: c.address,
                        idNumber: c.idNumber,
                        kycStatus: 'none', // Default status, to be updated with KYC features
                        lastTransactionDate: tx.timestamp,
                    });
                } else {
                    const existing = customerMap.get(key)!;
                    if(tx.timestamp > existing.lastTransactionDate) {
                        existing.lastTransactionDate = tx.timestamp;
                        customerMap.set(key, existing);
                    }
                }
            }
        });
    });
    return Array.from(customerMap.values()).sort((a, b) => b.lastTransactionDate.getTime() - a.lastTransactionDate.getTime());
}

export function useCustomers() {
    const [transactions] = useState<Transaction[]>(mockTransactions);
    const customers = useMemo(() => extractCustomersFromTransactions(transactions), [transactions]);
    
    return { customers };
}
