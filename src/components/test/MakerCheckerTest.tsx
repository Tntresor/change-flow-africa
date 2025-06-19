
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useMakerChecker } from "@/hooks/useMakerChecker";
import { useState } from "react";
import { Transaction } from "@/types/transaction";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

const REJECTION_REASONS = [
  "Montant trop élevé pour ce type de transaction",
  "Documents justificatifs insuffisants",
  "Informations client incomplètes",
  "Transaction suspecte - AML",
  "Dépassement des limites journalières",
  "Autre (préciser)"
];

export function MakerCheckerTest() {
  const { 
    pendingTransactions, 
    checkTransactionApproval, 
    submitForApproval, 
    approveTransaction, 
    rejectTransaction 
  } = useMakerChecker();

  const [testTransaction, setTestTransaction] = useState<Partial<Transaction>>({
    id: `test_${Date.now()}`,
    agencyId: "1",
    type: "currency_exchange",
    amount: 6000,
    fromCurrency: "EUR",
    toCurrency: "XOF"
  });

  const [approvalData, setApprovalData] = useState({
    comments: "",
    rejectionReason: "",
    customReason: ""
  });

  const [approvalResult, setApprovalResult] = useState<any>(null);
  const [selectedPendingId, setSelectedPendingId] = useState<string | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  const handleCheckApproval = () => {
    const result = checkTransactionApproval(testTransaction);
    setApprovalResult(result);
    console.log("Vérification d'approbation:", result);
  };

  const handleSubmitForApproval = () => {
    const result = submitForApproval(
      testTransaction,
      "emp_1",
      "Jean Dupont"
    );
    console.log("Soumission pour approbation:", result);
  };

  const handleApprove = (approvalId: string) => {
    approveTransaction(
      approvalId,
      "emp_2", 
      "Marie Supervisor",
      approvalData.comments
    );
    setShowApprovalDialog(false);
    setSelectedPendingId(null);
  };

  const handleReject = (approvalId: string) => {
    const finalReason = approvalData.rejectionReason === "Autre (préciser)" 
      ? approvalData.customReason 
      : approvalData.rejectionReason;
    
    rejectTransaction(
      approvalId,
      "emp_2",
      "Marie Supervisor", 
      finalReason
    );
    setShowApprovalDialog(false);
    setSelectedPendingId(null);
  };

  const openApprovalDialog = (pendingId: string) => {
    setSelectedPendingId(pendingId);
    setShowApprovalDialog(true);
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4 text-orange-500" />,
    approved: <CheckCircle className="w-4 h-4 text-green-500" />,
    rejected: <XCircle className="w-4 h-4 text-red-500" />
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Test Maker-Checker</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label>Agence</Label>
            <Select 
              value={testTransaction.agencyId} 
              onValueChange={(value) => setTestTransaction({...testTransaction, agencyId: value})}
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
              value={testTransaction.type} 
              onValueChange={(value) => setTestTransaction({...testTransaction, type: value as any})}
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
              value={testTransaction.amount} 
              onChange={(e) => setTestTransaction({...testTransaction, amount: Number(e.target.value)})}
            />
          </div>
          
          <div>
            <Label>Devise</Label>
            <Select 
              value={testTransaction.fromCurrency} 
              onValueChange={(value) => setTestTransaction({...testTransaction, fromCurrency: value})}
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
        
        <div className="flex gap-2 mb-4">
          <Button onClick={handleCheckApproval} variant="outline">
            Vérifier si approbation requise
          </Button>
          <Button onClick={handleSubmitForApproval}>
            Soumettre pour approbation
          </Button>
        </div>

        {approvalResult && (
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              {approvalResult.requiresApproval ? (
                <AlertCircle className="w-5 h-5 text-orange-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              <span className="font-medium">
                {approvalResult.requiresApproval ? "Approbation requise" : "Aucune approbation requise"}
              </span>
            </div>
            {approvalResult.rule && (
              <p className="text-sm text-gray-600">
                Règle déclenchée : {approvalResult.rule.transactionType} - Limite : {approvalResult.rule.maxAmount} {approvalResult.rule.currency}
              </p>
            )}
            {approvalResult.error && (
              <p className="text-sm text-red-600">{approvalResult.error}</p>
            )}
          </Card>
        )}
      </Card>

      {pendingTransactions.length > 0 && (
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
                      onClick={() => openApprovalDialog(pending.approvalRequest.id)}
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
      )}

      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Traiter la demande d'approbation</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Commentaires (optionnel)</Label>
              <Textarea 
                value={approvalData.comments}
                onChange={(e) => setApprovalData({...approvalData, comments: e.target.value})}
                placeholder="Commentaires pour l'approbation..."
              />
            </div>
            
            <div>
              <Label>Raison de rejet (si applicable)</Label>
              <Select 
                value={approvalData.rejectionReason}
                onValueChange={(value) => setApprovalData({...approvalData, rejectionReason: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une raison" />
                </SelectTrigger>
                <SelectContent>
                  {REJECTION_REASONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {approvalData.rejectionReason === "Autre (préciser)" && (
              <div>
                <Label>Préciser la raison</Label>
                <Input 
                  value={approvalData.customReason}
                  onChange={(e) => setApprovalData({...approvalData, customReason: e.target.value})}
                  placeholder="Préciser la raison du rejet..."
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              onClick={() => selectedPendingId && handleApprove(selectedPendingId)}
              className="bg-green-600 hover:bg-green-700"
            >
              Approuver
            </Button>
            <Button 
              onClick={() => selectedPendingId && handleReject(selectedPendingId)}
              variant="destructive"
              disabled={!approvalData.rejectionReason || (approvalData.rejectionReason === "Autre (préciser)" && !approvalData.customReason)}
            >
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
