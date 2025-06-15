
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Employee, EmployeePermission } from "@/types/liquidity";
import { mockAgencies } from "@/data/mockData";
import { useState } from "react";

interface EmployeeFormProps {
  employee?: Employee | null;
  onSubmit: (employee: Omit<Employee, 'id'>) => void;
  onCancel: () => void;
}

const allPermissions: EmployeePermission[] = [
  { action: "create_transaction", granted: false },
  { action: "approve_transaction", granted: false },
  { action: "manage_liquidity", granted: false },
  { action: "view_reports", granted: false },
  { action: "manage_employees", granted: false }
];

const permissionLabels = {
  create_transaction: "Créer des transactions",
  approve_transaction: "Approuver des transactions",
  manage_liquidity: "Gérer la liquidité",
  view_reports: "Voir les rapports",
  manage_employees: "Gérer les employés"
};

export function EmployeeForm({ employee, onSubmit, onCancel }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    agencyId: employee?.agencyId || '',
    role: employee?.role || 'agent' as const,
    permissions: employee?.permissions || allPermissions,
    isActive: employee?.isActive ?? true,
    hireDate: employee?.hireDate || new Date()
  });

  const handlePermissionChange = (action: string, granted: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.map(p => 
        p.action === action ? { ...p, granted } : p
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedAgency = mockAgencies.find(a => a.id === formData.agencyId);
    if (!selectedAgency) return;

    onSubmit({
      ...formData,
      agencyName: selectedAgency.name,
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {employee ? 'Modifier l\'employé' : 'Nouvel employé'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agency">Agence</Label>
              <Select value={formData.agencyId} onValueChange={(value) => setFormData(prev => ({ ...prev, agencyId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une agence" />
                </SelectTrigger>
                <SelectContent>
                  {mockAgencies.map((agency) => (
                    <SelectItem key={agency.id} value={agency.id}>
                      {agency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="role">Rôle</Label>
              <Select value={formData.role} onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="cashier">Caissier</SelectItem>
                  <SelectItem value="supervisor">Superviseur</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {formData.permissions.map((permission) => (
                <div key={permission.action} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.action}
                    checked={permission.granted}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(permission.action, checked as boolean)
                    }
                  />
                  <Label htmlFor={permission.action} className="text-sm">
                    {permissionLabels[permission.action as keyof typeof permissionLabels]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">
              {employee ? 'Mettre à jour' : 'Créer'}
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
