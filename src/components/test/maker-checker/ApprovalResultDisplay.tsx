
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ApprovalResultDisplayProps {
  result: {
    requiresApproval: boolean;
    rule?: any;
    error?: string;
  };
}

export function ApprovalResultDisplay({ result }: ApprovalResultDisplayProps) {
  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        {result.requiresApproval ? (
          <AlertCircle className="w-5 h-5 text-orange-500" />
        ) : (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
        <span className="font-medium">
          {result.requiresApproval ? "Approbation requise" : "Aucune approbation requise"}
        </span>
      </div>
      {result.rule && (
        <p className="text-sm text-gray-600">
          Règle déclenchée : {result.rule.transactionType} - Limite : {result.rule.maxAmount} {result.rule.currency}
        </p>
      )}
      {result.error && (
        <p className="text-sm text-red-600">{result.error}</p>
      )}
    </Card>
  );
}
