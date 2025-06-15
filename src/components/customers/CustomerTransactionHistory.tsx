
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types/transaction";
import { format } from "date-fns";
import { Badge as UiBadge } from "@/components/ui/badge";

interface CustomerTransactionHistoryProps {
    transactions: Transaction[];
    customerId: string;
}

export function CustomerTransactionHistory({ transactions, customerId }: CustomerTransactionHistoryProps) {
    if (transactions.length === 0) {
        return <p className="text-sm text-gray-500">Aucune transaction trouvée pour ce client.</p>
    }

    return (
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
                        <TableRow key={tx.id}>
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
    );
}
