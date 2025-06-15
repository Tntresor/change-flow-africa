
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { AddTransactionForm } from "@/components/transactions/AddTransactionForm";
import { Transaction } from "@/types/transaction";

interface TransactionDialogsProps {
  selectedTransaction: Transaction | null;
  showAddForm: boolean;
  onCloseDetailDialog: () => void;
  onCloseAddForm: () => void;
  onAddTransaction: (transaction: Transaction) => void;
}

export function TransactionDialogs({
  selectedTransaction,
  showAddForm,
  onCloseDetailDialog,
  onCloseAddForm,
  onAddTransaction
}: TransactionDialogsProps) {
  return (
    <>
      {/* Dialog de détail de transaction */}
      <Dialog open={!!selectedTransaction} onOpenChange={onCloseDetailDialog}>
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

      {/* Dialog de création de transaction */}
      <Dialog open={showAddForm} onOpenChange={onCloseAddForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <AddTransactionForm
            onSuccess={onAddTransaction}
            onCancel={onCloseAddForm}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
