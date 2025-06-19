
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionCancellationService } from "@/services/transactionCancellationService";
import { mockTransactions } from "@/data/mockData";
import { useState } from "react";
import { Transaction } from "@/types/transaction";
import { TransactionCancellation, ReversalTransaction } from "@/types/transactionCancellation";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function TransactionCancellationTest() {
  const { toast } = useToast();
  const [selectedTransactionId, setSelectedTransactionId] = useState("");
  const [userRole, setUserRole] = useState("supervisor");
  const [userAgency, setUserAgency] = useState("1");
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancellations, setCancellations] = useState<TransactionCancellation[]>([]);
  const [reversalTransactions, setReversalTransactions] = useState<ReversalTransaction[]>([]);

  const completedTransactions = mockTransactions.filter(t => t.status === 'completed').slice(0, 10);
  const selectedTransaction = completedTransactions.find(t => t.id === selectedTransactionId);

  const handleCheckCancellationPermission = () => {
    if (!selectedTransaction) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une transaction",
        variant: "destructive"
      });
      return;
    }

    const result = TransactionCancellationService.canCancelTransaction(
      selectedTransaction,
      userRole,
      userAgency
    );

    console.log("Vérification des permissions d'annulation:", result);
    
    toast({
      title: result.canCancel ? "Annulation autorisée" : "Annulation refusée",
      description: result.reason || "Vous pouvez annuler cette transaction",
      variant: result.canCancel ? "default" : "destructive"
    });
  };

  const handleCancelTransaction = () => {
    if (!selectedTransaction || !cancellationReason) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une transaction et saisir une raison",
        variant: "destructive"
      });
      return;
    }

    const permissionCheck = TransactionCancellationService.canCancelTransaction(
      selectedTransaction,
      userRole,
      userAgency
    );

    if (!permissionCheck.canCancel) {
      toast({
        title: "Annulation refusée",
        description: permissionCheck.reason,
        variant: "destructive"
      });
      return;
    }

    // Créer la transaction d'annulation
    const reversalTransaction = TransactionCancellationService.createReversalTransaction(
      selectedTransaction,
      "emp_current",
      "Utilisateur Test",
      cancellationReason
    );

    // Créer l'enregistrement d'annulation
    const cancellationRecord = TransactionCancellationService.createCancellationRecord(
      selectedTransaction.id,
      reversalTransaction.id,
      "emp_current",
      "Utilisateur Test",
      cancellationReason
    );

    // Ajouter aux listes
    setReversalTransactions(prev => [...prev, reversalTransaction]);
    setCancellations(prev => [...prev, cancellationRecord]);

    toast({
      title: "Transaction annulée",
      description: "La transaction a été annulée avec succès",
    });

    // Réinitialiser le formulaire
    setCancellationReason("");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Test d'annulation de transaction</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label>Rôle utilisateur</Label>
            <Select value={userRole} onValueChange={setUserRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="supervisor">Superviseur</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="administrator">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Agence utilisateur</Label>
            <Select value={userAgency} onValueChange={setUserAgency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Agence Paris</SelectItem>
                <SelectItem value="2">Agence Douala</SelectItem>
                <SelectItem value="3">Agence Casablanca</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-4">
          <Label>Transaction à annuler</Label>
          <Select value={selectedTransactionId} onValueChange={setSelectedTransactionId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une transaction" />
            </SelectTrigger>
            <SelectContent>
              {completedTransactions.map((transaction) => (
                <SelectItem key={transaction.id} value={transaction.id}>
                  {transaction.prefixId} - {transaction.amount} {transaction.fromCurrency} 
                  ({transaction.agencyName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTransaction && (
          <Card className="p-4 mb-4 bg-gray-50">
            <h4 className="font-medium mb-2">Détails de la transaction sélectionnée</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><strong>ID:</strong> {selectedTransaction.prefixId}</div>
              <div><strong>Montant:</strong> {selectedTransaction.amount} {selectedTransaction.fromCurrency}</div>
              <div><strong>Type:</strong> {selectedTransaction.type}</div>
              <div><strong>Agence:</strong> {selectedTransaction.agencyName}</div>
              <div><strong>Statut:</strong> {selectedTransaction.status}</div>
              <div><strong>Agent:</strong> {selectedTransaction.agent?.name || 'N/A'}</div>
            </div>
          </Card>
        )}

        <div className="mb-4">
          <Label>Raison de l'annulation</Label>
          <Textarea 
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            placeholder="Saisir la raison de l'annulation..."
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleCheckCancellationPermission} variant="outline">
            Vérifier les permissions
          </Button>
          <Button 
            onClick={handleCancelTransaction}
            variant="destructive"
            disabled={!selectedTransaction || !cancellationReason}
          >
            Annuler la transaction
          </Button>
        </div>
      </Card>

      {cancellations.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Historique des annulations</h3>
          
          <div className="space-y-4">
            {cancellations.map((cancellation) => (
              <div key={cancellation.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="font-medium">Transaction annulée</span>
                    <Badge variant="destructive">
                      {cancellation.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {cancellation.cancelledAt.toLocaleString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Transaction originale:</strong> {cancellation.originalTransactionId}
                  </div>
                  <div>
                    <strong>Transaction d'annulation:</strong> {cancellation.reversalTransactionId}
                  </div>
                  <div>
                    <strong>Annulée par:</strong> {cancellation.cancelledByName}
                  </div>
                  <div>
                    <strong>Raison:</strong> {cancellation.reason}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {reversalTransactions.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Transactions d'annulation créées</h3>
          
          <div className="space-y-4">
            {reversalTransactions.map((reversal) => (
              <div key={reversal.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">Transaction d'annulation</span>
                    <Badge variant="outline">Reversal</Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {reversal.timestamp.toLocaleString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>ID:</strong> {reversal.id}
                  </div>
                  <div>
                    <strong>Transaction originale:</strong> {reversal.originalTransactionId}
                  </div>
                  <div>
                    <strong>Montant:</strong> {reversal.amount} {reversal.fromCurrency}
                  </div>
                  <div>
                    <strong>Raison:</strong> {reversal.reversalReason}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
