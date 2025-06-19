
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transaction } from "@/types/transaction";

interface LedgerTransactionSelectorProps {
  transactions: Transaction[];
  selectedTransactionId: string;
  onTransactionSelect: (id: string) => void;
  selectedTransaction?: Transaction;
}

export function LedgerTransactionSelector({ 
  transactions, 
  selectedTransactionId, 
  onTransactionSelect, 
  selectedTransaction 
}: LedgerTransactionSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Transaction à traiter</label>
      <Select value={selectedTransactionId} onValueChange={onTransactionSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une transaction" />
        </SelectTrigger>
        <SelectContent>
          {transactions.map((transaction) => (
            <SelectItem key={transaction.id} value={transaction.id}>
              {transaction.prefixId} - {transaction.amount} {transaction.fromCurrency} 
              → {transaction.convertedAmount} {transaction.toCurrency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedTransaction && (
        <Card className="p-4 mt-4 bg-gray-50">
          <h4 className="font-medium mb-2">Transaction sélectionnée</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div><strong>Type:</strong> {selectedTransaction.type}</div>
            <div><strong>Montant:</strong> {selectedTransaction.amount} {selectedTransaction.fromCurrency}</div>
            <div><strong>Converti:</strong> {selectedTransaction.convertedAmount} {selectedTransaction.toCurrency}</div>
            <div><strong>Commission:</strong> {selectedTransaction.commission?.totalCommission || 0} {selectedTransaction.fromCurrency}</div>
            <div><strong>Frais:</strong> {selectedTransaction.fees} {selectedTransaction.fromCurrency}</div>
            <div><strong>Agence:</strong> {selectedTransaction.agencyName}</div>
          </div>
        </Card>
      )}
    </div>
  );
}
