
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AgencyLiquidity } from "@/types/liquidity";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface LiquidityAlertsProps {
  agencies: AgencyLiquidity[];
}

const severityConfig = {
  info: { color: "bg-blue-100 text-blue-800", icon: Info },
  warning: { color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
  critical: { color: "bg-red-100 text-red-800", icon: AlertCircle }
};

export function LiquidityAlerts({ agencies }: LiquidityAlertsProps) {
  const allAlerts = agencies.flatMap(agency => 
    agency.alerts.map(alert => ({ ...alert, agencyName: agency.agencyName }))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertes de Liquidité</CardTitle>
      </CardHeader>
      <CardContent>
        {allAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune alerte active
          </div>
        ) : (
          <div className="space-y-4">
            {allAlerts.map((alert) => {
              const severityInfo = severityConfig[alert.severity];
              const SeverityIcon = severityInfo.icon;

              return (
                <div key={alert.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={severityInfo.color}>
                          <SeverityIcon className="w-3 h-3 mr-1" />
                          {alert.severity}
                        </Badge>
                        <span className="text-sm font-medium">{alert.agencyName}</span>
                        <span className="text-sm text-gray-500">{alert.currency}</span>
                      </div>
                      
                      <p className="text-sm mb-2">{alert.message}</p>
                      
                      <div className="text-xs text-gray-500">
                        Solde actuel: {alert.currentBalance.toLocaleString()} | 
                        Seuil: {alert.threshold.toLocaleString()} |
                        {format(alert.timestamp, "dd/MM/yyyy HH:mm", { locale: fr })}
                      </div>
                    </div>
                    
                    {!alert.acknowledged && (
                      <Button size="sm" variant="outline">
                        Accuser réception
                      </Button>
                    )}
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
