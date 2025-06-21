
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useLiquidityManager } from "@/hooks/useLiquidityManager";
import { useToast } from "@/hooks/use-toast";

export function LiquidityTransferManager() {
  const { agencyLiquidity, transfers, transferLiquidity } = useLiquidityManager();
  const { toast } = useToast();
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [transferData, setTransferData] = useState({
    fromAgencyId: '',
    toAgencyId: '',
    currency: '',
    amount: '',
    reason: ''
  });

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transferData.fromAgencyId || !transferData.toAgencyId || !transferData.currency || !transferData.amount || !transferData.reason) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(transferData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Erreur",
        description: "Montant invalide",
        variant: "destructive"
      });
      return;
    }

    transferLiquidity({
      fromAgencyId: transferData.fromAgencyId,
      toAgencyId: transferData.toAgencyId,
      currency: transferData.currency,
      amount,
      reason: transferData.reason,
      initiatedBy: 'current_user'
    });

    setTransferData({
      fromAgencyId: '',
      toAgencyId: '',
      currency: '',
      amount: '',
      reason: ''
    });
    setShowTransferForm(false);

    toast({
      title: "Transfert initié",
      description: "Le transfert de liquidité a été initié avec succès",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Transferts de Liquidité</h2>
          <p className="text-gray-600">Gérer les transferts entre agences</p>
        </div>
        <Button onClick={() => setShowTransferForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau transfert
        </Button>
      </div>

      {showTransferForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5" />
              Nouveau Transfert de Liquidité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromAgency">Agence source</Label>
                  <Select 
                    value={transferData.fromAgencyId} 
                    onValueChange={(value) => setTransferData(prev => ({ ...prev, fromAgencyId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'agence source" />
                    </SelectTrigger>
                    <SelectContent>
                      {agencyLiquidity.map(agency => (
                        <SelectItem key={agency.agencyId} value={agency.agencyId}>
                          {agency.agencyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="toAgency">Agence destination</Label>
                  <Select 
                    value={transferData.toAgencyId} 
                    onValueChange={(value) => setTransferData(prev => ({ ...prev, toAgencyId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'agence destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {agencyLiquidity
                        .filter(agency => agency.agencyId !== transferData.fromAgencyId)
                        .map(agency => (
                          <SelectItem key={agency.agencyId} value={agency.agencyId}>
                            {agency.agencyName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Devise</Label>
                  <Select 
                    value={transferData.currency} 
                    onValueChange={(value) => setTransferData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="XOF">XOF</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="MAD">MAD</SelectItem>
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
                    placeholder="0.00"
                    value={transferData.amount}
                    onChange={(e) => setTransferData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Motif du transfert</Label>
                <Textarea
                  id="reason"
                  placeholder="Expliquez le motif de ce transfert..."
                  value={transferData.reason}
                  onChange={(e) => setTransferData(prev => ({ ...prev, reason: e.target.value }))}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">Effectuer le transfert</Button>
                <Button type="button" variant="outline" onClick={() => setShowTransferForm(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Historique des Transferts</CardTitle>
        </CardHeader>
        <CardContent>
          {transfers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun transfert enregistré
            </div>
          ) : (
            <div className="space-y-4">
              {transfers.map((transfer) => (
                <div key={transfer.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transfer.status)}
                      <Badge className={getStatusColor(transfer.status)}>
                        {transfer.status === 'pending' ? 'En cours' : 
                         transfer.status === 'completed' ? 'Terminé' : 'Rejeté'}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {transfer.timestamp.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>De:</strong> Agence {transfer.fromAgencyId}
                    </div>
                    <div>
                      <strong>Vers:</strong> Agence {transfer.toAgencyId}
                    </div>
                    <div>
                      <strong>Montant:</strong> {transfer.amount.toLocaleString()} {transfer.currency}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    <strong>Motif:</strong> {transfer.reason}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
