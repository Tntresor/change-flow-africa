
import { Button } from "@/components/ui/button";

interface LedgerActionsProps {
  onCreateEntries: () => void;
  onCreateReversalEntries: () => void;
  onCalculateBalances: () => void;
  onConsolidate: () => void;
  hasSelectedTransaction: boolean;
  hasEntries: boolean;
  hasBalances: boolean;
}

export function LedgerActions({
  onCreateEntries,
  onCreateReversalEntries,
  onCalculateBalances,
  onConsolidate,
  hasSelectedTransaction,
  hasEntries,
  hasBalances
}: LedgerActionsProps) {
  return (
    <div className="flex gap-2 mb-6">
      <Button 
        onClick={onCreateEntries}
        disabled={!hasSelectedTransaction}
      >
        Créer écritures comptables
      </Button>
      <Button 
        onClick={onCreateReversalEntries}
        variant="outline"
        disabled={!hasSelectedTransaction}
      >
        Créer écritures d'annulation
      </Button>
      <Button 
        onClick={onCalculateBalances}
        variant="outline"
        disabled={!hasEntries}
      >
        Calculer balances agences
      </Button>
      <Button 
        onClick={onConsolidate}
        variant="outline"
        disabled={!hasBalances}
      >
        Consolider
      </Button>
    </div>
  );
}
