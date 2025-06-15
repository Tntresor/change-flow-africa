
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ExchangeRateSettings } from "@/types/rates";
import { mockExchangeRates } from "@/data/ratesData";
import { Edit, Save, X, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

export function ExchangeRatesManager() {
  const { toast } = useToast();
  const [rates, setRates] = useState<ExchangeRateSettings[]>(mockExchangeRates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ExchangeRateSettings>>({});

  const handleEdit = (rate: ExchangeRateSettings) => {
    setEditingId(rate.id);
    setEditForm(rate);
  };

  const handleSave = () => {
    if (editingId && editForm) {
      const finalRate = editForm.baseRate! + editForm.spread!;
      setRates(rates.map(rate => 
        rate.id === editingId 
          ? { ...rate, ...editForm, finalRate, lastUpdated: new Date() }
          : rate
      ));
      setEditingId(null);
      setEditForm({});
      toast({
        title: "Taux mis à jour",
        description: "Le taux de change a été sauvegardé",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const toggleActive = (id: string) => {
    setRates(rates.map(rate => 
      rate.id === id ? { ...rate, isActive: !rate.isActive } : rate
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Gestion des Taux de Change et Spreads
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rates.map((rate) => (
            <div key={rate.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {rate.fromCurrency} → {rate.toCurrency}
                  </Badge>
                  <Switch
                    checked={rate.isActive}
                    onCheckedChange={() => toggleActive(rate.id)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  {editingId === rate.id ? (
                    <>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit(rate)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {editingId === rate.id ? (
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label>Taux de base</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={editForm.baseRate || ''}
                      onChange={(e) => setEditForm({...editForm, baseRate: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Spread</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={editForm.spread || ''}
                      onChange={(e) => setEditForm({...editForm, spread: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Taux final</Label>
                    <Input
                      value={((editForm.baseRate || 0) + (editForm.spread || 0)).toFixed(4)}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label>Spread (%)</Label>
                    <Input
                      value={editForm.baseRate ? (((editForm.spread || 0) / editForm.baseRate) * 100).toFixed(2) : '0.00'}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Taux de base:</span>
                    <div className="font-semibold">{rate.baseRate.toFixed(4)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Spread:</span>
                    <div className="font-semibold text-orange-600">+{rate.spread.toFixed(4)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Taux final:</span>
                    <div className="font-semibold text-green-600">{rate.finalRate.toFixed(4)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Spread (%):</span>
                    <div className="font-semibold text-blue-600">{((rate.spread / rate.baseRate) * 100).toFixed(2)}%</div>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 mt-2">
                Dernière mise à jour: {format(rate.lastUpdated, "PPp", { locale: fr })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
