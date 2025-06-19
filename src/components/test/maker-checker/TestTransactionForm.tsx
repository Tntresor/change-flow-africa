
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transaction } from "@/types/transaction";

interface TestTransactionFormProps {
  transaction: Partial<Transaction>;
  onTransactionChange: (transaction: Partial<Transaction>) => void;
  onCheckApproval: () => void;
  onSubmitForApproval: () => void;
}

export function TestTransactionForm({
  transaction,
  onTransactionChange,
  onCheckApproval,
  onSubmitForApproval
}: TestTransactionFormProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Test Maker-Checker</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Agence</Label>
          <Select 
            value={transaction.agencyId} 
            onValueChange={(value) => onTransactionChange({...transaction, agencyId: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Agence Paris Centre</SelectItem>
              <SelectItem value="2">Agence Douala</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Type de transaction</Label>
          <Select 
            value={transaction.type} 
            onValueChange={(value) => onTransactionChange({...transaction, type: value as any})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="currency_exchange">Change</SelectItem>
              <SelectItem value="international_transfer">Transfert international</SelectItem>
              <SelectItem value="internal_transfer">Transfert interne</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Montant</Label>
          <Input 
            type="number" 
            value={transaction.amount} 
            onChange={(e) => onTransactionChange({...transaction, amount: Number(e.target.value)})}
          />
        </div>
        
        <div>
          <Label>Devise</Label>
          <Select 
            value={transaction.fromCurrency} 
            onValueChange={(value) => onTransactionChange({...transaction, fromCurrency: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="XOF">XOF</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={onCheckApproval} variant="outline">
          Vérifier si approbation requise
        </Button>
        <Button onClick={onSubmitForApproval}>
          Soumettre pour approbation
        </Button>
      </div>
    </Card>
  );
}
