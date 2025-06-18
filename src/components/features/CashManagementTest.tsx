
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Banknote, TrendingUp, AlertTriangle, CheckCircle, ArrowRightLeft } from "lucide-react";
import { useCashManagementTest } from "@/hooks/useCashManagementTest";
import { useToast } from "@/hooks/use-toast";
import { formatAmount } from "@/data/mockData";

export function CashManagementTest() {
  const {
    agencyCashData,
    handleCashTransfer,
    isLoading,
    totalCash,
    alerts
  } = useCashManagementTest();
  const { toast } = useToast();

  const handleManageTreasury = (agencyId: string, agencyName: string) => {
    console.log(`Managing treasury for agency: ${agencyId} - ${agencyName}`);
    
    toast({
      title: "Gestion de trésorerie",
      description: `Interface de gestion ouverte pour ${agencyName}`,
    });
    
    // Appeler la fonction de gestion
    handleCashTransfer(agencyId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test - Gestion de caisse</h2>
        <p className="text-gray-600">
          Module de test pour la gestion centralisée de la trésorerie des agences
        </p>
      </div>

      {/* Tableau de bord global */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Banknote className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{formatAmount(totalCash, 'EUR')}</div>
                <div className="text-sm text-gray-600">Trésorerie totale</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{agencyCashData.length}</div>
                <div className="text-sm text-gray-600">Agences actives</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{alerts}</div>
                <div className="text-sm text-gray-600">Alertes actives</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des agences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agencyCashData.map((agency) => (
          <Card key={agency.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{agency.name}</span>
                <Badge variant={agency.status === 'optimal' ? 'default' : 'destructive'}>
                  {agency.status === 'optimal' ? 'Optimal' : 'Attention'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {agency.currencies.map((currency) => (
                <div key={currency.code} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{currency.code}</span>
                    <span className="text-sm">
                      {formatAmount(currency.amount, currency.code)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {currency.status === 'optimal' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                    <span className="text-xs text-gray-600">
                      Min: {formatAmount(currency.minThreshold, currency.code)} • 
                      Max: {formatAmount(currency.maxThreshold, currency.code)}
                    </span>
                  </div>
                </div>
              ))}
              
              <div className="pt-3 border-t">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  disabled={isLoading}
                  onClick={() => handleManageTreasury(agency.id, agency.name)}
                >
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Gérer la trésorerie
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
