
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types/transaction";
import { format } from "date-fns";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { useState } from "react";

interface CustomerTransactionHistoryProps {
    transactions: Transaction[];
    customerId: string;
}

export function CustomerTransactionHistory({ transactions, customerId }: CustomerTransactionHistoryProps) {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    if (transactions.length === 0) {
        return <p className="text-sm text-gray-500">Aucune transaction trouvée pour ce client.</p>
    }

    const handleTransactionClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
    };

    const handleCloseDialog = () => {
        setSelectedTransaction(null);
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map(tx => {
                        const isSender = tx.sender.id === customerId;
                        const role = isSender ? 'Envoyé' : 'Reçu';
                        const amount = isSender ? `-${tx.amount.toLocaleString()} ${tx.fromCurrency}` : `+${tx.convertedAmount.toLocaleString()} ${tx.toCurrency}`;
                        const amountClass = isSender ? "text-red-600" : "text-green-600";
                        
                        return (
                            <TableRow 
                                key={tx.id}
                                onClick={() => handleTransactionClick(tx)}
                                className="cursor-pointer hover:bg-gray-50"
                            >
                                <TableCell>{format(tx.timestamp, 'dd/MM/yyyy HH:mm')}</TableCell>
                                <TableCell className="capitalize">{tx.type.replace(/_/g, ' ')}</TableCell>
                                <TableCell className={`font-medium ${amountClass}`}>
                                    {amount}
                                    <span className="text-xs text-gray-500 ml-2">({role})</span>
                                </TableCell>
                                <TableCell>
                                    <UiBadge variant={tx.status === 'completed' ? 'default' : 'secondary'}>{tx.status}</UiBadge>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

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
        </>
    );
}
