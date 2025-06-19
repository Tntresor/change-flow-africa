
import { useMakerChecker } from "@/hooks/useMakerChecker";
import { useState } from "react";
import { Transaction } from "@/types/transaction";
import { TestTransactionForm } from "./maker-checker/TestTransactionForm";
import { ApprovalResultDisplay } from "./maker-checker/ApprovalResultDisplay";
import { PendingTransactionsList } from "./maker-checker/PendingTransactionsList";
import { ApprovalDialog } from "./maker-checker/ApprovalDialog";

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

  const handleApprove = () => {
    if (!selectedPendingId) return;
    
    approveTransaction(
      selectedPendingId,
      "emp_2", 
      "Marie Supervisor",
      approvalData.comments
    );
    setShowApprovalDialog(false);
    setSelectedPendingId(null);
  };

  const handleReject = () => {
    if (!selectedPendingId) return;
    
    const finalReason = approvalData.rejectionReason === "Autre (préciser)" 
      ? approvalData.customReason 
      : approvalData.rejectionReason;
    
    rejectTransaction(
      selectedPendingId,
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

  return (
    <div className="space-y-6">
      <TestTransactionForm
        transaction={testTransaction}
        onTransactionChange={setTestTransaction}
        onCheckApproval={handleCheckApproval}
        onSubmitForApproval={handleSubmitForApproval}
      />

      {approvalResult && (
        <ApprovalResultDisplay result={approvalResult} />
      )}

      <PendingTransactionsList
        pendingTransactions={pendingTransactions}
        onTreatRequest={openApprovalDialog}
      />

      <ApprovalDialog
        open={showApprovalDialog}
        onOpenChange={setShowApprovalDialog}
        approvalData={approvalData}
        onApprovalDataChange={setApprovalData}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
