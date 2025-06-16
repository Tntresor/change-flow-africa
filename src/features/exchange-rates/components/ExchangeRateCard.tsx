
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ExchangeRateSettings } from "@/types/rates";

interface ExchangeRateCardProps {
  rate: ExchangeRateSettings;
  showDetails?: boolean;
}

export function ExchangeRateCard({ rate, showDetails = false }: ExchangeRateCardProps) {
  const spreadPercentage = rate.baseRate > 0 ? (rate.totalSpread / rate.baseRate) * 100 : 0;

  return (
    <Card className={`${rate.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {rate.fromCurrency} → {rate.toCurrency}
          </CardTitle>
          <Badge variant={rate.isActive ? "default" : "secondary"}>
            {rate.isActive ? "Actif" : "Inactif"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Taux Bid</p>
              <p className="font-semibold text-red-600">{rate.bidRate.toFixed(4)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Taux Ask</p>
              <p className="font-semibold text-green-600">{rate.askRate.toFixed(4)}</p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Taux Base</p>
                <p className="font-medium">{rate.baseRate.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-gray-600">Spread</p>
                <p className="font-medium">{rate.totalSpread.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-gray-600">Spread %</p>
                <p className="font-medium">{spreadPercentage.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 text-xs text-gray-500">
          Mis à jour: {rate.lastUpdated.toLocaleString('fr-FR')}
        </div>
      </CardContent>
    </Card>
  );
}
