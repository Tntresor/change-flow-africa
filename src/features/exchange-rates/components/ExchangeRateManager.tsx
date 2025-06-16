
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Save } from "lucide-react";
import { ExchangeRateCard } from "./ExchangeRateCard";
import { useExchangeRates } from "../hooks/useExchangeRates";

export function ExchangeRateManager() {
  const { rates, loading, saveRates, getActiveRates } = useExchangeRates();
  const activeRates = getActiveRates();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Gestionnaire de Taux de Change
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {activeRates.length} taux actifs sur {rates.length} configurés
              </p>
            </div>
            <Button 
              onClick={saveRates} 
              disabled={loading}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rates.map((rate) => (
              <ExchangeRateCard 
                key={rate.id} 
                rate={rate} 
                showDetails={true}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
