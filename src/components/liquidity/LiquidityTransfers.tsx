
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LiquidityTransfer } from "@/types/liquidity";
import { ArrowRight, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface LiquidityTransfersProps {
  transfers: LiquidityTransfer[];
}

const statusConfig = {
  pending: { color: "bg-orange-100 text-orange-800", icon: Clock },
  completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { color: "bg-red-100 text-red-800", icon: XCircle }
};

export function LiquidityTransfers({ transfers }: LiquidityTransfersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des Transferts</CardTitle>
      </CardHeader>
      <CardContent>
        {transfers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun transfert de liquidité enregistré
          </div>
        ) : (
          <div className="space-y-4">
            {transfers.map((transfer) => {
              const statusInfo = statusConfig[transfer.status];
              const StatusIcon = statusInfo.icon;

              return (
                <div key={transfer.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={statusInfo.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {transfer.status === 'pending' ? 'En cours' : 
                       transfer.status === 'completed' ? 'Terminé' : 'Rejeté'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {format(transfer.timestamp, "dd/MM/yyyy HH:mm", { locale: fr })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Agence A</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Agence B</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <div className="font-medium">
                        {transfer.amount.toLocaleString()} {transfer.currency}
                      </div>
                      <div className="text-gray-500">{transfer.reason}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Par: {transfer.initiatedBy}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
