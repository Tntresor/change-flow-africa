
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AgencyLiquidity } from "@/types/liquidity";
import { AlertCircle, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface AgencyLiquidityViewProps {
  agencies: AgencyLiquidity[];
}

const statusConfig = {
  critical: { color: "bg-red-100 text-red-800", icon: XCircle },
  low: { color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
  normal: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  high: { color: "bg-blue-100 text-blue-800", icon: AlertCircle }
};

export function AgencyLiquidityView({ agencies }: AgencyLiquidityViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {agencies.map((agency) => (
        <Card key={agency.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {agency.agencyName}
              <Badge variant="outline">
                {agency.balances.length} devise{agency.balances.length > 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agency.balances.map((balance) => {
              const statusInfo = statusConfig[balance.status];
              const StatusIcon = statusInfo.icon;
              const progressValue = Math.min(
                (balance.balance / balance.maxThreshold) * 100,
                100
              );

              return (
                <div key={balance.currency} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{balance.currency}</span>
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {balance.status}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium">
                      {balance.balance.toLocaleString()}
                    </span>
                  </div>
                  
                  <Progress value={progressValue} className="h-2" />
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Min: {balance.minThreshold.toLocaleString()}</span>
                    <span>Disponible: {balance.availableAmount.toLocaleString()}</span>
                    <span>Max: {balance.maxThreshold.toLocaleString()}</span>
                  </div>
                  
                  {balance.reservedAmount > 0 && (
                    <div className="text-xs text-orange-600">
                      Réservé: {balance.reservedAmount.toLocaleString()}
                    </div>
                  )}
                </div>
              );
            })}
            
            {agency.alerts.length > 0 && (
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {agency.alerts.length} alerte{agency.alerts.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              Dernière mise à jour: {agency.lastUpdated.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
