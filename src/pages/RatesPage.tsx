
import { ExchangeRatesManager } from "@/components/rates/ExchangeRatesManager";
import { CommissionTiersManager } from "@/components/rates/CommissionTiersManager";
import { CommissionsManager } from "@/components/rates/CommissionsManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Taux et Commissions</h1>
        <p className="text-gray-600">
          Configurez les taux de change, spreads, commissions et frais appliqués aux transactions
        </p>
      </div>

      <Tabs defaultValue="rates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rates">Taux de Change</TabsTrigger>
          <TabsTrigger value="commissions">Paliers de Commissions</TabsTrigger>
          <TabsTrigger value="fees">Frais & Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rates">
          <ExchangeRatesManager />
        </TabsContent>
        
        <TabsContent value="commissions">
          <CommissionTiersManager />
        </TabsContent>
        
        <TabsContent value="fees">
          <CommissionsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
