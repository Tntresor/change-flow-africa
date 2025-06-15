
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CommissionTierSettings } from "@/types/rates";
import { mockCommissionTiers } from "@/data/ratesData";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CommissionTiersManager() {
  const { toast } = useToast();
  const [tiers, setTiers] = useState<CommissionTierSettings[]>(mockCommissionTiers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CommissionTierSettings>>({});

  const handleEdit = (tier: CommissionTierSettings) => {
    setEditingId(tier.id);
    setEditForm(tier);
  };

  const handleSave = () => {
    if (editingId && editForm) {
      setTiers(tiers.map(tier => 
        tier.id === editingId 
          ? { ...tier, ...editForm }
          : tier
      ));
      setEditingId(null);
      setEditForm({});
      toast({
        title: "Palier mis à jour",
        description: "Les modifications ont été sauvegardées",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const toggleActive = (id: string) => {
    setTiers(tiers.map(tier => 
      tier.id === id ? { ...tier, isActive: !tier.isActive } : tier
    ));
  };

  const calculateCommission = (amount: number, tier: CommissionTierSettings) => {
    return tier.fixedAmount + (amount * tier.percentage / 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Gestion des Paliers de Commissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tiers.map((tier) => (
            <div key={tier.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {tier.name}
                  </Badge>
                  <Switch
                    checked={tier.isActive}
                    onCheckedChange={() => toggleActive(tier.id)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  {editingId === tier.id ? (
                    <>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit(tier)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {editingId === tier.id ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Montant min (€)</Label>
                    <Input
                      type="number"
                      value={editForm.minAmount || ''}
                      onChange={(e) => setEditForm({...editForm, minAmount: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Montant max (€)</Label>
                    <Input
                      type="number"
                      value={editForm.maxAmount || ''}
                      onChange={(e) => setEditForm({...editForm, maxAmount: parseFloat(e.target.value) || undefined})}
                    />
                  </div>
                  <div>
                    <Label>Montant fixe (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editForm.fixedAmount || ''}
                      onChange={(e) => setEditForm({...editForm, fixedAmount: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Pourcentage (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editForm.percentage || ''}
                      onChange={(e) => setEditForm({...editForm, percentage: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Montant min:</span>
                      <div className="font-semibold">{tier.minAmount}€</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Montant max:</span>
                      <div className="font-semibold">{tier.maxAmount ? `${tier.maxAmount}€` : 'Illimité'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Montant fixe:</span>
                      <div className="font-semibold">{tier.fixedAmount}€</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Pourcentage:</span>
                      <div className="font-semibold">{tier.percentage}%</div>
                    </div>
                  </div>
                  
                  {/* Exemples de calculs */}
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <div className="font-medium mb-2">Exemples de commissions :</div>
                    <div className="grid grid-cols-3 gap-4">
                      {[100, 500, 1000].map(amount => {
                        if (amount >= tier.minAmount && (!tier.maxAmount || amount <= tier.maxAmount)) {
                          const commission = calculateCommission(amount, tier);
                          return (
                            <div key={amount}>
                              <span className="text-gray-600">{amount}€ → </span>
                              <span className="font-semibold text-green-600">{commission.toFixed(2)}€</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
