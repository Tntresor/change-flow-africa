
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { ExchangeRateItem } from "./ExchangeRateItem";
import { useExchangeRatesManager } from "./hooks/useExchangeRatesManager";

export function ExchangeRatesManager() {
  const {
    rates,
    editingId,
    editForm,
    setEditForm,
    handleEdit,
    handleSave,
    handleCancel,
    toggleActive,
    calculateBidAskFromInputs
  } = useExchangeRatesManager();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Gestion des Taux de Change (Modèle Bid/Ask)
        </CardTitle>
        <p className="text-sm text-gray-600">
          Configuration des taux avec spread réparti équitablement autour du taux mid-market
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rates.map((rate) => (
            <ExchangeRateItem
              key={rate.id}
              rate={rate}
              isEditing={editingId === rate.id}
              editForm={editForm}
              setEditForm={setEditForm}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onToggleActive={toggleActive}
              calculateBidAskFromInputs={calculateBidAskFromInputs}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
