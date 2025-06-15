
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { formatAmount } from "@/data/mockData";

interface CashOperation {
  id: string;
  type: 'cash_in' | 'cash_out';
  currency: string;
  amount: number;
  reason: string;
  reference: string;
  timestamp: Date;
  agencyId: string;
  agencyName: string;
}

interface CashOperationsListProps {
  operations: CashOperation[];
  agencyId?: string;
}

export function CashOperationsList({ operations, agencyId }: CashOperationsListProps) {
  const filteredOperations = agencyId 
    ? operations.filter(op => op.agencyId === agencyId)
    : operations;

  const sortedOperations = filteredOperations.sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  if (sortedOperations.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          Aucune opération de liquidité enregistrée
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des Opérations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedOperations.map((operation) => (
            <div 
              key={operation.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                {operation.type === 'cash_in' ? (
                  <ArrowDownCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <ArrowUpCircle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={operation.type === 'cash_in' ? 'default' : 'secondary'}
                      className={operation.type === 'cash_in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    >
                      {operation.type === 'cash_in' ? 'Cash In' : 'Cash Out'}
                    </Badge>
                    <span className="font-mono text-xs text-gray-500">
                      {operation.reference}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {operation.reason}
                  </div>
                  {!agencyId && (
                    <div className="text-xs text-gray-500">
                      {operation.agencyName}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-semibold ${
                  operation.type === 'cash_in' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {operation.type === 'cash_in' ? '+' : '-'}
                  {formatAmount(operation.amount, operation.currency)}
                </div>
                <div className="text-xs text-gray-500">
                  {operation.timestamp.toLocaleDateString('fr-FR')} à {operation.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
