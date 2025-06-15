
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CardTitle } from "@/components/ui/card";

interface CommissionTiersHeaderProps {
  selectedTransactionType: string;
  onTransactionTypeChange: (value: string) => void;
  onAddNewTier: () => void;
}

const transactionTypes = [
  { value: "all", label: "Tous les types" },
  { value: "internal_transfer", label: "Transfert interne" },
  { value: "international_transfer", label: "Transfert international" },
  { value: "currency_exchange", label: "Change" },
  { value: "payment", label: "Paiement" }
];

export function CommissionTiersHeader({ selectedTransactionType, onTransactionTypeChange, onAddNewTier }: CommissionTiersHeaderProps) {
  return (
    <>
      <CardTitle className="flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Gestion des Paliers de Commissions
      </CardTitle>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label>Type de transaction :</Label>
          <Select value={selectedTransactionType} onValueChange={onTransactionTypeChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {transactionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onAddNewTier}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un palier
        </Button>
      </div>
    </>
  );
}
