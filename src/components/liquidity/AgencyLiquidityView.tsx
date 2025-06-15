
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AgencyLiquidity } from "@/types/liquidity";
import { AlertCircle, CheckCircle, AlertTriangle, XCircle, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CashOperationForm } from "./CashOperationForm";
import { CashOperationsList } from "./CashOperationsList";
import { useLiquidityManager } from "@/hooks/useLiquidityManager";

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
  const [selectedAgency, setSelectedAgency] = useState<AgencyLiquidity | null>(null);
  const [showOperationForm, setShowOperationForm] = useState(false);
  const { processCashOperation, cashOperations } = useLiquidityManager();

  const handleCashOperation = (
    agencyId: string,
    operation: {
      type: 'cash_in' | 'cash_out';
      currency: string;
      amount: number;
      reason: string;
      reference: string;
    }
  ) => {
    processCashOperation(agencyId, operation);
    setShowOperationForm(false);
    setSelectedAgency(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agencies.map((agency) => (
          <Card key={agency.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {agency.agencyName}
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {agency.balances.length} devise{agency.balances.length > 1 ? 's' : ''}
                  </Badge>
                  <Dialog open={showOperationForm && selectedAgency?.id === agency.id} onOpenChange={(open) => {
                    setShowOperationForm(open);
                    if (!open) setSelectedAgency(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedAgency(agency)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Opération
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <CashOperationForm
                        agencyId={agency.agencyId}
                        agencyName={agency.agencyName}
                        availableCurrencies={agency.balances.map(b => b.currency)}
                        onSubmit={(operation) => handleCashOperation(agency.agencyId, operation)}
                        onCancel={() => {
                          setShowOperationForm(false);
                          setSelectedAgency(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
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

      {/* Cash Operations History */}
      <CashOperationsList operations={cashOperations} />
    </div>
  );
}
