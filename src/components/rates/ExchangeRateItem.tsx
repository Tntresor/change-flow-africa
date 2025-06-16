
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit3, Save, X } from "lucide-react";
import { ExchangeRateSettings } from "@/types/rates";
import { ExchangeRateDisplayInfo } from "./ExchangeRateDisplayInfo";
import { ExchangeRateEditForm } from "./ExchangeRateEditForm";

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
    <div className={`p-4 border rounded-lg ${rate.isActive ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">
            {rate.fromCurrency} → {rate.toCurrency}
          </h3>
          <Switch
            checked={rate.isActive}
            onCheckedChange={() => onToggleActive(rate.id)}
          />
          <span className="text-sm text-gray-500">
            {rate.isActive ? 'Actif' : 'Inactif'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={onSave} className="gap-1">
                <Save className="w-3 h-3" />
                Sauvegarder
              </Button>
              <Button size="sm" variant="outline" onClick={onCancel} className="gap-1">
                <X className="w-3 h-3" />
                Annuler
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => onEdit(rate)} className="gap-1">
              <Edit3 className="w-3 h-3" />
              Modifier
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
        <ExchangeRateDisplayInfo
          rate={rate}
          spreadPercentage={spreadPercentage}
        />
      )}

      <div className="mt-3 text-xs text-gray-500">
        Dernière mise à jour: {rate.lastUpdated.toLocaleString('fr-FR')}
      </div>
    </div>
  );
}
