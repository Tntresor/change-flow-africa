
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

interface CashOperationFormProps {
  agencyId: string;
  agencyName: string;
  availableCurrencies: string[];
  onSubmit: (operation: {
    type: 'cash_in' | 'cash_out';
    currency: string;
    amount: number;
    reason: string;
    reference: string;
  }) => void;
  onCancel: () => void;
}

export function CashOperationForm({ 
  agencyId, 
  agencyName, 
  availableCurrencies, 
  onSubmit, 
  onCancel 
}: CashOperationFormProps) {
  const [formData, setFormData] = useState({
    type: 'cash_in' as 'cash_in' | 'cash_out',
    currency: '',
    amount: '',
    reason: '',
    reference: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.currency || !formData.amount || !formData.reason) {
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    // Générer une référence automatique si vide
    let reference = formData.reference;
    if (!reference) {
      const prefix = formData.type === 'cash_in' ? 'CASHIN' : 'CASHOUT';
      const agencyCode = agencyName.substring(7, 10).toUpperCase(); // Extraire code agence
      const timestamp = Date.now().toString().slice(-3);
      reference = `${prefix}-${agencyCode}-${timestamp}`;
    }

    onSubmit({
      type: formData.type,
      currency: formData.currency,
      amount,
      reason: formData.reason,
      reference
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {formData.type === 'cash_in' ? (
            <ArrowDownCircle className="w-5 h-5 text-green-600" />
          ) : (
            <ArrowUpCircle className="w-5 h-5 text-red-600" />
          )}
          Nouvelle Opération de Liquidité - {agencyName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type d'opération</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: 'cash_in' | 'cash_out') => 
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash_in">
                    <div className="flex items-center gap-2">
                      <ArrowDownCircle className="w-4 h-4 text-green-600" />
                      Cash In (Réapprovisionnement)
                    </div>
                  </SelectItem>
                  <SelectItem value="cash_out">
                    <div className="flex items-center gap-2">
                      <ArrowUpCircle className="w-4 h-4 text-red-600" />
                      Cash Out (Collecte)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currency">Devise</Label>
              <Select 
                value={formData.currency} 
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  {availableCurrencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      <Badge variant="outline">{currency}</Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="amount">Montant</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="reference">Référence (optionnel)</Label>
            <Input
              id="reference"
              placeholder="Sera générée automatiquement si vide"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="reason">Motif / Description</Label>
            <Textarea
              id="reason"
              placeholder="Décrivez le motif de cette opération..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {formData.type === 'cash_in' ? 'Effectuer le réapprovisionnement' : 'Effectuer la collecte'}
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
