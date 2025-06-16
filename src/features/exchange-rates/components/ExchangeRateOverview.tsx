
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useExchangeRates } from "../hooks/useExchangeRates";

export function ExchangeRateOverview() {
  const { rates, getActiveRates } = useExchangeRates();
  const activeRates = getActiveRates();
  
  const avgSpread = activeRates.length > 0 
    ? activeRates.reduce((sum, rate) => sum + (rate.totalSpread / rate.baseRate) * 100, 0) / activeRates.length
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux Actifs</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeRates.length}</div>
          <p className="text-xs text-muted-foreground">
            sur {rates.length} configurés
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Spread Moyen</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgSpread.toFixed(2)}%</div>
          <p className="text-xs text-muted-foreground">
            Moyenne des taux actifs
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dernière MAJ</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {rates.length > 0 
              ? new Date(Math.max(...rates.map(r => r.lastUpdated.getTime()))).toLocaleDateString('fr-FR')
              : 'N/A'
            }
          </div>
          <p className="text-xs text-muted-foreground">
            Dernier taux modifié
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
