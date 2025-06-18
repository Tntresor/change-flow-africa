
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit2, Save, X, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ThirdPartyFee {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'percentage';
  currency?: string;
}

interface TransactionType {
  id: string;
  name: string;
  thirdPartyFees: ThirdPartyFee[];
}

const mockTransactionTypes: TransactionType[] = [
  {
    id: 'currency_exchange',
    name: 'Change de devises',
    thirdPartyFees: [
      { id: '1', name: 'Frais bancaires', amount: 2.50, type: 'fixed', currency: 'EUR' },
      { id: '2', name: 'Commission réseau', amount: 0.5, type: 'percentage' },
      { id: '3', name: 'Frais réglementaires', amount: 1.00, type: 'fixed', currency: 'EUR' }
    ]
  },
  {
    id: 'money_transfer',
    name: 'Transfert d\'argent',
    thirdPartyFees: [
      { id: '4', name: 'Frais SWIFT', amount: 15.00, type: 'fixed', currency: 'EUR' },
      { id: '5', name: 'Commission correspondant', amount: 1.0, type: 'percentage' },
      { id: '6', name: 'Frais de compliance', amount: 5.00, type: 'fixed', currency: 'EUR' }
    ]
  },
  {
    id: 'cash_operation',
    name: 'Opération de caisse',
    thirdPartyFees: [
      { id: '7', name: 'Frais de transport', amount: 25.00, type: 'fixed', currency: 'EUR' },
      { id: '8', name: 'Assurance transport', amount: 0.1, type: 'percentage' }
    ]
  }
];

export function TransactionCostEditor() {
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(mockTransactionTypes);
  const [editingFee, setEditingFee] = useState<{ typeId: string; feeId: string } | null>(null);
  const [editForm, setEditForm] = useState<Partial<ThirdPartyFee>>({});
  const { toast } = useToast();

  const handleEditFee = (typeId: string, fee: ThirdPartyFee) => {
    setEditingFee({ typeId, feeId: fee.id });
    setEditForm(fee);
  };

  const handleSaveFee = () => {
    if (!editingFee) return;

    setTransactionTypes(prev => prev.map(type => {
      if (type.id === editingFee.typeId) {
        return {
          ...type,
          thirdPartyFees: type.thirdPartyFees.map(fee => {
            if (fee.id === editingFee.feeId) {
              return { ...fee, ...editForm } as ThirdPartyFee;
            }
            return fee;
          })
        };
      }
      return type;
    }));

    setEditingFee(null);
    setEditForm({});
    
    toast({
      title: "Frais mis à jour",
      description: "Les frais tiers ont été modifiés avec succès",
    });
  };

  const handleCancelEdit = () => {
    setEditingFee(null);
    setEditForm({});
  };

  const formatFeeAmount = (fee: ThirdPartyFee) => {
    if (fee.type === 'percentage') {
      return `${fee.amount}%`;
    } else {
      return `${fee.amount} ${fee.currency || 'EUR'}`;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Coûts de transaction</h2>
        <p className="text-gray-600">Gérez les frais tiers par type de transaction</p>
      </div>

      {transactionTypes.map((transactionType) => (
        <Card key={transactionType.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              {transactionType.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactionType.thirdPartyFees.map((fee) => {
                const isEditing = editingFee?.typeId === transactionType.id && editingFee?.feeId === fee.id;
                
                return (
                  <div key={fee.id} className="flex items-center justify-between p-4 border rounded-lg">
                    {isEditing ? (
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Nom du frais</Label>
                            <Input
                              value={editForm.name || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label>Montant</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={editForm.amount || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                            />
                          </div>
                          <div>
                            <Label>Devise (si fixe)</Label>
                            <Input
                              value={editForm.currency || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, currency: e.target.value }))}
                              disabled={editForm.type === 'percentage'}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={handleSaveFee}>
                            <Save className="w-4 h-4 mr-2" />
                            Sauvegarder
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            <X className="w-4 h-4 mr-2" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{fee.name}</span>
                            <Badge variant={fee.type === 'fixed' ? 'default' : 'secondary'}>
                              {fee.type === 'fixed' ? 'Fixe' : 'Pourcentage'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatFeeAmount(fee)}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditFee(transactionType.id, fee)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
