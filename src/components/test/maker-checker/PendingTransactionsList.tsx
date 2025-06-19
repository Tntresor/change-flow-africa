
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { PendingTransaction } from "@/types/makerChecker";

interface PendingTransactionsListProps {
  pendingTransactions: PendingTransaction[];
  onTreatRequest: (approvalId: string) => void;
}

export function PendingTransactionsList({ pendingTransactions, onTreatRequest }: PendingTransactionsListProps) {
  const statusIcons = {
    pending: <Clock className="w-4 h-4 text-orange-500" />,
    approved: <CheckCircle className="w-4 h-4 text-green-500" />,
    rejected: <XCircle className="w-4 h-4 text-red-500" />
  };

  if (pendingTransactions.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Transactions en attente d'approbation</h3>
      
      <div className="space-y-4">
        {pendingTransactions.map((pending) => (
          <div key={`pending-${pending.id}-${pending.approvalRequest.id}`} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {statusIcons[pending.approvalRequest.status]}
                <span className="font-medium">
                  Transaction {pending.originalTransaction.type}
                </span>
                <Badge variant="outline">
                  {pending.approvalRequest.status}
                </Badge>
              </div>
              <span className="text-sm text-gray-500">
                {pending.originalTransaction.amount} {pending.originalTransaction.fromCurrency}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              Demandé par: {pending.approvalRequest.requestedByName}
            </p>
            
            {pending.approvalRequest.status === 'pending' && (
              <div className="flex gap-2">
                <Button 
                  onClick={() => onTreatRequest(pending.approvalRequest.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Traiter la demande
                </Button>
              </div>
            )}
            
            {pending.approvalRequest.status !== 'pending' && (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-sm">
                  <strong>Traité par:</strong> {pending.approvalRequest.approvedByName}
                </p>
                {pending.approvalRequest.comments && (
                  <p className="text-sm">
                    <strong>Commentaires:</strong> {pending.approvalRequest.comments}
                  </p>
                )}
                {pending.approvalRequest.rejectionReason && (
                  <p className="text-sm text-red-600">
                    <strong>Raison du rejet:</strong> {pending.approvalRequest.rejectionReason}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
