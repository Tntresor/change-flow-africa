
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ExchangeRateSettings } from "@/types/rates";
import { mockExchangeRates } from "@/data/ratesData";
import { Edit, Save, X, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
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

  const calculateBidAskFromInputs = (baseRate: number, totalSpread: number) => {
    const halfSpread = totalSpread / 2;
    return {
      bidRate: baseRate - halfSpread,
      askRate: baseRate + halfSpread
    };
  };

  const handleSave = () => {
    if (editingId && editForm && editForm.baseRate && editForm.totalSpread) {
      const { bidRate, askRate } = calculateBidAskFromInputs(editForm.baseRate, editForm.totalSpread);
      
      setRates(rates.map(rate => 
        rate.id === editingId 
          ? { 
              ...rate, 
              ...editForm, 
              bidRate,
              askRate,
              lastUpdated: new Date() 
            }
          : rate
      ));
      setEditingId(null);
      setEditForm({});
      toast({
        title: "Taux mis à jour",
        description: "Le taux de change a été sauvegardé avec le nouveau modèle Bid/Ask",
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
          Gestion des Taux de Change (Modèle Bid/Ask)
        </CardTitle>
        <p className="text-sm text-gray-600">
          Configuration des taux avec spread réparti équitablement autour du taux mid-market
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rates.map((rate) => {
            const spreadPercentage = rate.baseRate > 0 ? (rate.totalSpread / rate.baseRate) * 100 : 0;
            
            return (
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
                  <div className="grid grid-cols-5 gap-4">
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
                      <Label>Spread total</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={editForm.totalSpread || ''}
                        onChange={(e) => setEditForm({...editForm, totalSpread: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Taux Bid</Label>
                      <Input
                        value={editForm.baseRate && editForm.totalSpread ? 
                          (editForm.baseRate - editForm.totalSpread / 2).toFixed(4) : ''}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label>Taux Ask</Label>
                      <Input
                        value={editForm.baseRate && editForm.totalSpread ? 
                          (editForm.baseRate + editForm.totalSpread / 2).toFixed(4) : ''}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label>Spread (%)</Label>
                      <Input
                        value={editForm.baseRate && editForm.totalSpread ? 
                          ((editForm.totalSpread / editForm.baseRate) * 100).toFixed(2) : '0.00'}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Taux de base (Mid):</span>
                      <div className="font-semibold">{rate.baseRate.toFixed(4)}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-red-600" />
                      <div>
                        <span className="text-gray-500">Taux Bid:</span>
                        <div className="font-semibold text-red-600">{rate.bidRate.toFixed(4)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <div>
                        <span className="text-gray-500">Taux Ask:</span>
                        <div className="font-semibold text-green-600">{rate.askRate.toFixed(4)}</div>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Spread total:</span>
                      <div className="font-semibold text-orange-600">{rate.totalSpread.toFixed(4)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Spread (%):</span>
                      <div className="font-semibold text-blue-600">{spreadPercentage.toFixed(2)}%</div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-2 flex justify-between">
                  <span>Dernière mise à jour: {format(rate.lastUpdated, "PPp", { locale: fr })}</span>
                  <span>Différence Bid/Ask: {(rate.askRate - rate.bidRate).toFixed(4)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
