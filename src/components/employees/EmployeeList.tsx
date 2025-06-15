
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/types/liquidity";
import { Edit, UserX, Mail, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDeactivate: (employeeId: string) => void;
}

const roleConfig = {
  manager: { label: "Manager", color: "bg-purple-100 text-purple-800" },
  cashier: { label: "Caissier", color: "bg-blue-100 text-blue-800" },
  agent: { label: "Agent", color: "bg-green-100 text-green-800" },
  supervisor: { label: "Superviseur", color: "bg-orange-100 text-orange-800" }
};

export function EmployeeList({ employees, onEdit, onDeactivate }: EmployeeListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((employee) => {
        const roleInfo = roleConfig[employee.role];
        const activePermissions = employee.permissions.filter(p => p.granted).length;

        return (
          <Card key={employee.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                {employee.firstName} {employee.lastName}
                <Badge className={roleInfo.color}>
                  {roleInfo.label}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="truncate">{employee.email}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{employee.phone}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Embauché le {format(employee.hireDate, "dd/MM/yyyy", { locale: fr })}</span>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-600">Agence:</span>
                <span className="ml-1 font-medium">{employee.agencyName}</span>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-600">Permissions:</span>
                <span className="ml-1 font-medium">{activePermissions}/{employee.permissions.length}</span>
              </div>
              
              {employee.lastLogin && (
                <div className="text-xs text-gray-500">
                  Dernière connexion: {format(employee.lastLogin, "dd/MM/yyyy HH:mm", { locale: fr })}
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(employee)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Modifier
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onDeactivate(employee.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <UserX className="w-4 h-4 mr-1" />
                  Désactiver
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
