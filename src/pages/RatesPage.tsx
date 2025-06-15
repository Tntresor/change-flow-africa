
import { ExchangeRatesManager } from "@/components/rates/ExchangeRatesManager";
import { CommissionsManager } from "@/components/rates/CommissionsManager";

export default function RatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Taux et Commissions</h1>
        <p className="text-gray-600">
          Configurez les taux de change, commissions et frais appliqués aux transactions
        </p>
      </div>

      <ExchangeRatesManager />
      <CommissionsManager />
    </div>
  );
}
