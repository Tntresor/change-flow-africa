
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommissionTierSettings } from "@/types/rates";
import { mockCommissionTiers } from "@/data/ratesData";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CommissionTiersManager() {
  const { toast } = useToast();
  const [tiers, setTiers] = useState<CommissionTierSettings[]>(mockCommissionTiers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CommissionTierSettings>>({});
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>("all");

  const transactionTypes = [
    { value: "all", label: "Tous les types" },
    { value: "internal_transfer", label: "Transfert interne" },
    { value: "international_transfer", label: "Transfert international" },
    { value: "currency_exchange", label: "Change" },
    { value: "payment", label: "Paiement" }
  ];

  const commissionTypes = [
    { value: "percentage", label: "Pourcentage" },
    { value: "fixed", label: "Montant fixe" },
    { value: "percentage_plus_fixed", label: "Pourcentage + montant fixe" },
    { value: "percentage_with_minimum", label: "Pourcentage avec minimum fixe" }
  ];

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

  const addNewTier = () => {
    const newTier: CommissionTierSettings = {
      id: `tier_${Date.now()}`,
      name: `Nouveau palier ${tiers.length + 1}`,
      minAmount: 0,
      maxAmount: undefined,
      fixedAmount: 0,
      percentage: 0,
      currency: "EUR",
      isActive: true,
      order: tiers.length + 1,
      type: 'percentage',
      value: 0,
      transactionType: selectedTransactionType === "all" ? undefined : selectedTransactionType
    };
    setTiers([...tiers, newTier]);
    toast({
      title: "Nouveau palier ajouté",
      description: "Vous pouvez maintenant le configurer",
    });
  };

  const deleteTier = (id: string) => {
    setTiers(tiers.filter(tier => tier.id !== id));
    toast({
      title: "Palier supprimé",
      description: "Le palier a été supprimé avec succès",
    });
  };

  const toggleActive = (id: string) => {
    setTiers(tiers.map(tier => 
      tier.id === id ? { ...tier, isActive: !tier.isActive } : tier
    ));
  };

  const calculateCommission = (amount: number, tier: CommissionTierSettings) => {
    switch (tier.type) {
      case 'percentage':
        return amount * tier.percentage / 100;
      case 'fixed':
        return tier.fixedAmount;
      case 'percentage_plus_fixed':
        return (amount * tier.percentage / 100) + tier.fixedAmount;
      case 'percentage_with_minimum':
        const percentageAmount = amount * tier.percentage / 100;
        return Math.max(percentageAmount, tier.fixedAmount);
      default:
        return 0;
    }
  };

  const filteredTiers = selectedTransactionType === "all" 
    ? tiers 
    : tiers.filter(tier => !tier.transactionType || tier.transactionType === selectedTransactionType);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Gestion des Paliers de Commissions
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label>Type de transaction :</Label>
            <Select value={selectedTransactionType} onValueChange={setSelectedTransactionType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addNewTier}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un palier
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTiers.map((tier) => (
            <div key={tier.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {tier.name}
                  </Badge>
                  <Badge variant={tier.type === 'percentage' ? 'default' : 'secondary'}>
                    {commissionTypes.find(t => t.value === tier.type)?.label}
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
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(tier)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteTier(tier.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {editingId === tier.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Nom du palier</Label>
                      <Input
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Type de commission</Label>
                      <Select
                        value={editForm.type}
                        onValueChange={(value: any) => setEditForm({...editForm, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {commissionTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Pourcentage (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={editForm.percentage || ''}
                        onChange={(e) => setEditForm({...editForm, percentage: parseFloat(e.target.value)})}
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
                      <span className="text-gray-500">Pourcentage:</span>
                      <div className="font-semibold">{tier.percentage}%</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Montant fixe:</span>
                      <div className="font-semibold">{tier.fixedAmount}€</div>
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
