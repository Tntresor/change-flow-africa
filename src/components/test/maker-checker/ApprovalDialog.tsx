
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const REJECTION_REASONS = [
  "Montant trop élevé pour ce type de transaction",
  "Documents justificatifs insuffisants",
  "Informations client incomplètes",
  "Transaction suspecte - AML",
  "Dépassement des limites journalières",
  "Autre (préciser)"
];

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  approvalData: {
    comments: string;
    rejectionReason: string;
    customReason: string;
  };
  onApprovalDataChange: (data: any) => void;
  onApprove: () => void;
  onReject: () => void;
}

export function ApprovalDialog({
  open,
  onOpenChange,
  approvalData,
  onApprovalDataChange,
  onApprove,
  onReject
}: ApprovalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Traiter la demande d'approbation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Commentaires (optionnel)</Label>
            <Textarea 
              value={approvalData.comments}
              onChange={(e) => onApprovalDataChange({...approvalData, comments: e.target.value})}
              placeholder="Commentaires pour l'approbation..."
            />
          </div>
          
          <div>
            <Label>Raison de rejet (si applicable)</Label>
            <Select 
              value={approvalData.rejectionReason}
              onValueChange={(value) => onApprovalDataChange({...approvalData, rejectionReason: value})}
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
                onChange={(e) => onApprovalDataChange({...approvalData, customReason: e.target.value})}
                placeholder="Préciser la raison du rejet..."
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            onClick={onApprove}
            className="bg-green-600 hover:bg-green-700"
          >
            Approuver
          </Button>
          <Button 
            onClick={onReject}
            variant="destructive"
            disabled={!approvalData.rejectionReason || (approvalData.rejectionReason === "Autre (préciser)" && !approvalData.customReason)}
          >
            Rejeter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
