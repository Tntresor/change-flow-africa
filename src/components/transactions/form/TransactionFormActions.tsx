
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface TransactionFormActionsProps {
  onCancel: () => void;
}

export function TransactionFormActions({ onCancel }: TransactionFormActionsProps) {
  return (
    <div className="flex items-center gap-3 pt-4">
      <Button type="submit" className="gap-2">
        <Save className="w-4 h-4" />
        Créer la transaction
      </Button>
      <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
        <X className="w-4 h-4" />
        Annuler
      </Button>
    </div>
  );
}
