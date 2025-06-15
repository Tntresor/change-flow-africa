
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommissionSettings, FeeSettings } from "@/types/rates";
import { mockCommissions, mockFees } from "@/data/ratesData";
import { Edit, Save, X, Percent, DollarSign, Plus } from "lucide-react";

export function CommissionsManager() {
  const [commissions, setCommissions] = useState<CommissionSettings[]>(mockCommissions);
  const [fees, setFees] = useState<FeeSettings[]>(mockFees);
  const [editingCommissionId, setEditingCommissionId] = useState<string | null>(null);
  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  const [editCommissionForm, setEditCommissionForm] = useState<Partial<CommissionSettings>>({});
  const [editFeeForm, setEditFeeForm] = useState<Partial<FeeSettings>>({});

  const handleEditCommission = (commission: CommissionSettings) => {
    setEditingCommissionId(commission.id);
    setEditCommissionForm(commission);
  };

  const handleSaveCommission = () => {
    if (editingCommissionId && editCommissionForm) {
      setCommissions(commissions.map(commission => 
        commission.id === editingCommissionId 
          ? { ...commission, ...editCommissionForm }
          : commission
      ));
      setEditingCommissionId(null);
      setEditCommissionForm({});
    }
  };

  const handleEditFee = (fee: FeeSettings) => {
    setEditingFeeId(fee.id);
    setEditFeeForm(fee);
  };

  const handleSaveFee = () => {
    if (editingFeeId && editFeeForm) {
      setFees(fees.map(fee => 
        fee.id === editingFeeId 
          ? { ...fee, ...editFeeForm }
          : fee
      ));
      setEditingFeeId(null);
      setEditFeeForm({});
    }
  };

  const toggleCommissionActive = (id: string) => {
    setCommissions(commissions.map(commission => 
      commission.id === id ? { ...commission, isActive: !commission.isActive } : commission
    ));
  };

  const toggleFeeActive = (id: string) => {
    setFees(fees.map(fee => 
      fee.id === id ? { ...fee, isActive: !fee.isActive } : fee
    ));
  };

  return (
    <div className="space-y-6">
      {/* Commissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            Gestion des Commissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commissions.map((commission) => (
              <div key={commission.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{commission.name}</h4>
                    <Badge variant={commission.type === 'percentage' ? 'default' : 'secondary'}>
                      {commission.type === 'percentage' ? 'Pourcentage' : 'Fixe'}
                    </Badge>
                    <Switch
                      checked={commission.isActive}
                      onCheckedChange={() => toggleCommissionActive(commission.id)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {editingCommissionId === commission.id ? (
                      <>
                        <Button size="sm" onClick={handleSaveCommission}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingCommissionId(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleEditCommission(commission)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {editingCommissionId === commission.id ? (
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={editCommissionForm.type}
                        onValueChange={(value: 'percentage' | 'fixed') => 
                          setEditCommissionForm({...editCommissionForm, type: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Pourcentage</SelectItem>
                          <SelectItem value="fixed">Fixe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Valeur</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editCommissionForm.value || ''}
                        onChange={(e) => setEditCommissionForm({...editCommissionForm, value: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Montant min</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editCommissionForm.minAmount || ''}
                        onChange={(e) => setEditCommissionForm({...editCommissionForm, minAmount: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Montant max</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editCommissionForm.maxAmount || ''}
                        onChange={(e) => setEditCommissionForm({...editCommissionForm, maxAmount: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Valeur:</span>
                      <div className="font-semibold">
                        {commission.value}{commission.type === 'percentage' ? '%' : ` ${commission.currency}`}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Min:</span>
                      <div className="font-semibold">{commission.minAmount || '-'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Max:</span>
                      <div className="font-semibold">{commission.maxAmount || '-'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Devise:</span>
                      <div className="font-semibold">{commission.currency}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Frais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Gestion des Frais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fees.map((fee) => (
              <div key={fee.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{fee.name}</h4>
                    <Switch
                      checked={fee.isActive}
                      onCheckedChange={() => toggleFeeActive(fee.id)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {editingFeeId === fee.id ? (
                      <>
                        <Button size="sm" onClick={handleSaveFee}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingFeeId(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleEditFee(fee)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {editingFeeId === fee.id ? (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Montant</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editFeeForm.amount || ''}
                        onChange={(e) => setEditFeeForm({...editFeeForm, amount: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Devise</Label>
                      <Select
                        value={editFeeForm.currency}
                        onValueChange={(value) => setEditFeeForm({...editFeeForm, currency: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={editFeeForm.description || ''}
                        onChange={(e) => setEditFeeForm({...editFeeForm, description: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Montant:</span>
                      <div className="font-semibold">{fee.amount} {fee.currency}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Devise:</span>
                      <div className="font-semibold">{fee.currency}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Description:</span>
                      <div className="font-semibold">{fee.description || '-'}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
