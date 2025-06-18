
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

interface ReconciliationEntryFormProps {
  agencyId: string;
  onSubmit: (data: {
    agentId: string;
    agentName: string;
    tillId: string;
    currency: string;
    actualCash: number;
  }) => void;
  onCancel: () => void;
}

export function ReconciliationEntryForm({ agencyId, onSubmit, onCancel }: ReconciliationEntryFormProps) {
  const [formData, setFormData] = useState({
    agentId: '',
    agentName: '',
    tillId: '',
    currency: '',
    actualCash: ''
  });

  // Mock data - à remplacer par de vraies données
  const mockAgents = [
    { id: 'emp_1', name: 'Marie Dubois' },
    { id: 'emp_2', name: 'Jean Martin' },
    { id: 'emp_3', name: 'Sophie Bernard' }
  ];

  const mockTills = [
    { id: 'till_1', name: 'Caisse 1 - Marie' },
    { id: 'till_2', name: 'Caisse 2 - Jean' },
    { id: 'till_3', name: 'Caisse 3 - Sophie' }
  ];

  const currencies = ['EUR', 'USD', 'XOF', 'MAD', 'AED'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agentId || !formData.tillId || !formData.currency || !formData.actualCash) {
      return;
    }

    const actualCash = parseFloat(formData.actualCash);
    if (isNaN(actualCash) || actualCash < 0) {
      return;
    }

    onSubmit({
      agentId: formData.agentId,
      agentName: formData.agentName,
      tillId: formData.tillId,
      currency: formData.currency,
      actualCash
    });
  };

  const handleAgentChange = (agentId: string) => {
    const agent = mockAgents.find(a => a.id === agentId);
    setFormData(prev => ({
      ...prev,
      agentId,
      agentName: agent?.name || ''
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Nouvelle Entrée de Réconciliation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agent">Agent</Label>
              <Select 
                value={formData.agentId} 
                onValueChange={handleAgentChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un agent" />
                </SelectTrigger>
                <SelectContent>
                  {mockAgents.map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="till">Caisse</Label>
              <Select 
                value={formData.tillId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, tillId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une caisse" />
                </SelectTrigger>
                <SelectContent>
                  {mockTills.map(till => (
                    <SelectItem key={till.id} value={till.id}>
                      {till.name}
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
                value={formData.currency} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="actualCash">Cash réel en caisse</Label>
              <Input
                id="actualCash"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.actualCash}
                onChange={(e) => setFormData(prev => ({ ...prev, actualCash: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Créer l'entrée de réconciliation
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
