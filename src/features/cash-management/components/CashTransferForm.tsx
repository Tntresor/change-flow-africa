
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CashierTill, SafeVault, CashTransferRequest } from "@/types/cashManagement";
import { ArrowRightLeft, Users, Vault } from "lucide-react";

interface CashTransferFormProps {
  tills: CashierTill[];
  vault: SafeVault;
  onSubmit: (request: CashTransferRequest) => void;
  onCancel: () => void;
}

export function CashTransferForm({ tills, vault, onSubmit, onCancel }: CashTransferFormProps) {
  const [formData, setFormData] = useState({
    fromType: 'till' as 'till' | 'vault',
    toType: 'vault' as 'till' | 'vault',
    fromId: '',
    toId: '',
    currency: '',
    amount: '',
    reason: '',
    initiatedBy: 'current_user' // À remplacer par l'utilisateur connecté
  });

  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);

  const handleFromSelection = (type: 'till' | 'vault', id: string) => {
    setFormData(prev => ({ ...prev, fromType: type, fromId: id, currency: '' }));
    
    // Mettre à jour les devises disponibles
    if (type === 'vault') {
      setAvailableCurrencies(vault.balances.map(b => b.currency));
    } else {
      const selectedTill = tills.find(t => t.id === id);
      if (selectedTill) {
        setAvailableCurrencies(selectedTill.balances.map(b => b.currency));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fromId || !formData.toId || !formData.currency || !formData.amount || !formData.reason) {
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    const request: CashTransferRequest = {
      fromType: formData.fromType,
      toType: formData.toType,
      fromId: formData.fromId,
      toId: formData.toId,
      currency: formData.currency,
      amount,
      reason: formData.reason,
      initiatedBy: formData.initiatedBy
    };

    onSubmit(request);
  };

  const getAvailableBalance = () => {
    if (!formData.fromId || !formData.currency) return 0;

    if (formData.fromType === 'vault') {
      const balance = vault.balances.find(b => b.currency === formData.currency);
      return balance?.availableAmount || 0;
    } else {
      const till = tills.find(t => t.id === formData.fromId);
      const balance = till?.balances.find(b => b.currency === formData.currency);
      return balance?.availableAmount || 0;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-blue-600" />
          Transfert de Liquidité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Source */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Source</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Coffre */}
              <div 
                className={`p-3 border rounded cursor-pointer transition-colors ${
                  formData.fromType === 'vault' && formData.fromId === vault.id
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleFromSelection('vault', vault.id)}
              >
                <div className="flex items-center gap-2">
                  <Vault className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">Coffre-Fort</span>
                </div>
                <div className="mt-2 space-y-1">
                  {vault.balances.slice(0, 3).map(balance => (
                    <div key={balance.currency} className="text-sm text-gray-600">
                      {balance.currency}: {formatAmount(balance.availableAmount)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Caisses */}
              <div className="space-y-2">
                {tills.slice(0, 4).map(till => (
                  <div
                    key={till.id}
                    className={`p-2 border rounded cursor-pointer transition-colors ${
                      formData.fromType === 'till' && formData.fromId === till.id
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleFromSelection('till', till.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-green-600" />
                      <span className="text-sm font-medium">{till.cashierName}</span>
                      {till.isActive && <Badge variant="outline" className="text-xs">Actif</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Destination</Label>
            <Select 
              value={`${formData.toType}_${formData.toId}`} 
              onValueChange={(value) => {
                const [type, id] = value.split('_');
                setFormData(prev => ({ 
                  ...prev, 
                  toType: type as 'till' | 'vault', 
                  toId: id 
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={`vault_${vault.id}`}>
                  <div className="flex items-center gap-2">
                    <Vault className="w-4 h-4 text-purple-600" />
                    Coffre-Fort
                  </div>
                </SelectItem>
                {tills.map(till => (
                  <SelectItem key={till.id} value={`till_${till.id}`}>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-600" />
                      {till.cashierName}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Devise et montant */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Devise</Label>
              <Select 
                value={formData.currency} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                disabled={!formData.fromId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  {availableCurrencies.map(currency => (
                    <SelectItem key={currency} value={currency}>
                      <Badge variant="outline">{currency}</Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Montant</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={getAvailableBalance()}
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                disabled={!formData.currency}
              />
              {formData.currency && (
                <div className="text-sm text-gray-500 mt-1">
                  Disponible: {formatAmount(getAvailableBalance())} {formData.currency}
                </div>
              )}
            </div>
          </div>

          {/* Motif */}
          <div>
            <Label htmlFor="reason">Motif du transfert</Label>
            <Textarea
              id="reason"
              placeholder="Décrivez le motif de ce transfert..."
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={!formData.amount || !formData.reason}>
              Effectuer le transfert
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
