
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, TrendingUp, TrendingDown } from "lucide-react";
import { LedgerEntry } from "@/types/ledger";

interface LedgerEntriesDisplayProps {
  entries: LedgerEntry[];
}

export function LedgerEntriesDisplay({ entries }: LedgerEntriesDisplayProps) {
  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'asset': return 'bg-blue-100 text-blue-800';
      case 'liability': return 'bg-red-100 text-red-800';
      case 'revenue': return 'bg-green-100 text-green-800';
      case 'expense': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  if (entries.length === 0) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Écritures comptables ({entries.length})</h3>
      
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div key={`${entry.id}-${index}`} className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="font-medium">{entry.accountName}</span>
                <Badge className={getAccountTypeColor(entry.accountType)}>
                  {entry.accountType}
                </Badge>
                {entry.isReversalEntry && (
                  <Badge variant="destructive">ANNULATION</Badge>
                )}
              </div>
              <span className="text-sm text-gray-500">{entry.currency}</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <strong>Débit:</strong> 
                <div className="flex items-center gap-1">
                  {entry.debitAmount > 0 && <TrendingUp className="w-3 h-3 text-green-500" />}
                  {formatAmount(entry.debitAmount, entry.currency)}
                </div>
              </div>
              <div>
                <strong>Crédit:</strong>
                <div className="flex items-center gap-1">
                  {entry.creditAmount > 0 && <TrendingDown className="w-3 h-3 text-red-500" />}
                  {formatAmount(entry.creditAmount, entry.currency)}
                </div>
              </div>
              <div>
                <strong>Solde:</strong>
                <span className={entry.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatAmount(entry.balance, entry.currency)}
                </span>
              </div>
              <div>
                <strong>Réf:</strong> {entry.reference}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-2">{entry.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
