
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Save, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ExchangeRateSettings } from "@/types/rates";
import { ExchangeRateEditForm } from "./ExchangeRateEditForm";
import { ExchangeRateDisplayInfo } from "./ExchangeRateDisplayInfo";

interface ExchangeRateItemProps {
  rate: ExchangeRateSettings;
  isEditing: boolean;
  editForm: Partial<ExchangeRateSettings>;
  setEditForm: (form: Partial<ExchangeRateSettings>) => void;
  onEdit: (rate: ExchangeRateSettings) => void;
  onSave: () => void;
  onCancel: () => void;
  onToggleActive: (id: string) => void;
  calculateBidAskFromInputs: (baseRate: number, totalSpread: number) => { bidRate: number; askRate: number };
}

export function ExchangeRateItem({
  rate,
  isEditing,
  editForm,
  setEditForm,
  onEdit,
  onSave,
  onCancel,
  onToggleActive,
  calculateBidAskFromInputs
}: ExchangeRateItemProps) {
  const spreadPercentage = rate.baseRate > 0 ? (rate.totalSpread / rate.baseRate) * 100 : 0;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono">
            {rate.fromCurrency} → {rate.toCurrency}
          </Badge>
          <Switch
            checked={rate.isActive}
            onCheckedChange={() => onToggleActive(rate.id)}
          />
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={onSave}>
                <Save className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => onEdit(rate)}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <ExchangeRateEditForm
          editForm={editForm}
          setEditForm={setEditForm}
          calculateBidAskFromInputs={calculateBidAskFromInputs}
        />
      ) : (
        <ExchangeRateDisplayInfo rate={rate} spreadPercentage={spreadPercentage} />
      )}

      <div className="text-xs text-gray-500 mt-2 flex justify-between">
        <span>Dernière mise à jour: {format(rate.lastUpdated, "PPp", { locale: fr })}</span>
        <span>Différence Bid/Ask: {(rate.askRate - rate.bidRate).toFixed(4)}</span>
      </div>
    </div>
  );
}
