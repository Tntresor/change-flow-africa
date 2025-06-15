
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmployeeManager } from "@/hooks/useEmployeeManager";
import { EmployeeList } from "./EmployeeList";
import { EmployeeForm } from "./EmployeeForm";
import { Employee } from "@/types/liquidity";
import { Users, Plus, Building } from "lucide-react";

export function EmployeeManager() {
  const { employees, addEmployee, updateEmployee, deactivateEmployee } = useEmployeeManager();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const activeEmployees = employees.filter(emp => emp.isActive);
  const employeesByAgency = activeEmployees.reduce((acc, emp) => {
    if (!acc[emp.agencyId]) {
      acc[emp.agencyId] = [];
    }
    acc[emp.agencyId].push(emp);
    return acc;
  }, {} as Record<string, Employee[]>);

  const handleAddEmployee = (employeeData: Omit<Employee, 'id'>) => {
    addEmployee(employeeData);
    setShowAddForm(false);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowAddForm(true);
  };

  const handleUpdateEmployee = (employeeData: Omit<Employee, 'id'>) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, employeeData);
      setEditingEmployee(null);
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Employés</h1>
          <p className="text-gray-600 mt-2">Gérez vos équipes et leurs permissions</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Employé
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employés actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployees.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agences</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(employeesByAgency).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeEmployees.filter(emp => emp.role === 'manager').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {showAddForm ? (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
          onCancel={() => {
            setShowAddForm(false);
            setEditingEmployee(null);
          }}
        />
      ) : (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Tous les employés</TabsTrigger>
            {Object.entries(employeesByAgency).map(([agencyId, employees]) => (
              <TabsTrigger key={agencyId} value={agencyId}>
                {employees[0].agencyName} ({employees.length})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <EmployeeList
              employees={activeEmployees}
              onEdit={handleEditEmployee}
              onDeactivate={deactivateEmployee}
            />
          </TabsContent>

          {Object.entries(employeesByAgency).map(([agencyId, agencyEmployees]) => (
            <TabsContent key={agencyId} value={agencyId}>
              <EmployeeList
                employees={agencyEmployees}
                onEdit={handleEditEmployee}
                onDeactivate={deactivateEmployee}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
