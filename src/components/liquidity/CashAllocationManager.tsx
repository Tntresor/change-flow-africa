
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Vault, Users, DollarSign, Clock, CheckCircle, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CashierTill {
  id: string;
  cashierId: string;
  cashierName: string;
  agencyId: string;
  balances: Array<{
    currency: string;
    balance: number;
    allocated: number;
    available: number;
  }>;
  isActive: boolean;
  status: 'open' | 'closed' | 'suspended';
  lastActivity: Date;
}

export function CashAllocationManager() {
  const { toast } = useToast();
  const [tills, setTills] = useState<CashierTill[]>([
    {
      id: 'till_1',
      cashierId: 'emp_1',
      cashierName: 'Marie Dubois',
      agencyId: 'AG001',
      balances: [
        { currency: 'EUR', balance: 5000, allocated: 3000, available: 2000 },
        { currency: 'XOF', balance: 2500000, allocated: 1500000, available: 1000000 }
      ],
      isActive: true,
      status: 'open',
      lastActivity: new Date()
    },
    {
      id: 'till_2',
      cashierId: 'emp_2',
      cashierName: 'Jean Martin',
      agencyId: 'AG001',
      balances: [
        { currency: 'EUR', balance: 3000, allocated: 2000, available: 1000 },
        { currency: 'USD', balance: 4000, allocated: 2500, available: 1500 }
      ],
      isActive: false,
      status: 'closed',
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ]);

  const [allocationForm, setAllocationForm] = useState({
    tillId: '',
    currency: '',
    amount: '',
    type: 'allocate' as 'allocate' | 'collect'
  });

  const handleAllocation = () => {
    if (!allocationForm.tillId || !allocationForm.currency || !allocationForm.amount) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(allocationForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Erreur",
        description: "Montant invalide",
        variant: "destructive"
      });
      return;
    }

    setTills(prev => prev.map(till => {
      if (till.id === allocationForm.tillId) {
        return {
          ...till,
          balances: till.balances.map(balance => {
            if (balance.currency === allocationForm.currency) {
              const newAllocated = allocationForm.type === 'allocate' 
                ? balance.allocated + amount 
                : Math.max(0, balance.allocated - amount);
              return {
                ...balance,
                allocated: newAllocated,
                available: balance.balance - newAllocated
              };
            }
            return balance;
          }),
          lastActivity: new Date()
        };
      }
      return till;
    }));

    toast({
      title: allocationForm.type === 'allocate' ? "Allocation effectuée" : "Collecte effectuée",
      description: `${amount} ${allocationForm.currency} ${allocationForm.type === 'allocate' ? 'alloué à' : 'collecté de'} ${tills.find(t => t.id === allocationForm.tillId)?.cashierName}`,
    });

    setAllocationForm({ tillId: '', currency: '', amount: '', type: 'allocate' });
  };

  const handleTillStatusChange = (tillId: string, newStatus: 'open' | 'closed' | 'suspended') => {
    setTills(prev => prev.map(till => 
      till.id === tillId 
        ? { ...till, status: newStatus, isActive: newStatus === 'open', lastActivity: new Date() }
        : till
    ));

    toast({
      title: "Statut de caisse modifié",
      description: `Caisse ${newStatus === 'open' ? 'ouverte' : newStatus === 'closed' ? 'fermée' : 'suspendue'}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <X className="w-4 h-4" />;
      case 'suspended': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Allocation et Clôture des Caisses</h2>
          <p className="text-gray-600">Gérer l'allocation de liquidité aux caisses des employés</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle allocation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Allocation de Liquidité</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Caisse</Label>
                <Select 
                  value={allocationForm.tillId} 
                  onValueChange={(value) => setAllocationForm(prev => ({ ...prev, tillId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une caisse" />
                  </SelectTrigger>
                  <SelectContent>
                    {tills.map(till => (
                      <SelectItem key={till.id} value={till.id}>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {till.cashierName}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type d'opération</Label>
                  <Select 
                    value={allocationForm.type} 
                    onValueChange={(value: 'allocate' | 'collect') => setAllocationForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="allocate">Allouer</SelectItem>
                      <SelectItem value="collect">Collecter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Devise</Label>
                  <Select 
                    value={allocationForm.currency} 
                    onValueChange={(value) => setAllocationForm(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="XOF">XOF</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="MAD">MAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Montant</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={allocationForm.amount}
                  onChange={(e) => setAllocationForm(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>

              <Button onClick={handleAllocation} className="w-full">
                {allocationForm.type === 'allocate' ? 'Allouer' : 'Collecter'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tills.map((till) => (
          <Card key={till.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {till.cashierName}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(till.status)}>
                    {getStatusIcon(till.status)}
                    {till.status === 'open' ? 'Ouverte' : 
                     till.status === 'closed' ? 'Fermée' : 'Suspendue'}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {till.balances.map((balance) => (
                <div key={balance.currency} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">{balance.currency}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {balance.balance.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-blue-50 p-2 rounded">
                      <div className="text-blue-600 font-medium">Alloué</div>
                      <div>{balance.allocated.toLocaleString()}</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <div className="text-green-600 font-medium">Disponible</div>
                      <div>{balance.available.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleTillStatusChange(till.id, till.status === 'open' ? 'closed' : 'open')}
                  className="flex-1"
                >
                  {till.status === 'open' ? 'Fermer' : 'Ouvrir'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleTillStatusChange(till.id, 'suspended')}
                  disabled={till.status === 'suspended'}
                >
                  Suspendre
                </Button>
              </div>
              
              <div className="text-xs text-gray-500">
                Dernière activité: {till.lastActivity.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
