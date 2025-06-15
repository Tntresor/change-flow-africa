
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

export function ExchangeRatesManager() {
  const [rates, setRates] = useState<ExchangeRateSettings[]>(mockExchangeRates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ExchangeRateSettings>>({});

  const handleEdit = (rate: ExchangeRateSettings) => {
    setEditingId(rate.id);
    setEditForm(rate);
  };

  const handleSave = () => {
    if (editingId && editForm) {
      const finalRate = editForm.baseRate! * (1 - (editForm.margin! / 100));
      setRates(rates.map(rate => 
        rate.id === editingId 
          ? { ...rate, ...editForm, finalRate, lastUpdated: new Date() }
          : rate
      ));
      setEditingId(null);
      setEditForm({});
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
          Gestion des Taux de Change
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
                <div className="grid grid-cols-3 gap-4">
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
                    <Label>Marge (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editForm.margin || ''}
                      onChange={(e) => setEditForm({...editForm, margin: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Taux final</Label>
                    <Input
                      value={(editForm.baseRate! * (1 - (editForm.margin! / 100))).toFixed(4)}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Taux de base:</span>
                    <div className="font-semibold">{rate.baseRate.toFixed(4)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Marge:</span>
                    <div className="font-semibold">{rate.margin}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Taux final:</span>
                    <div className="font-semibold text-green-600">{rate.finalRate.toFixed(4)}</div>
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
