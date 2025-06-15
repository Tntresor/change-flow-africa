
import { useState } from "react";
import { Employee } from "@/types/liquidity";

const mockEmployees: Employee[] = [
  {
    id: "emp_1",
    firstName: "Marie",
    lastName: "Dubois",
    email: "marie.dubois@exchangehub.com",
    phone: "+33 1 23 45 67 89",
    agencyId: "1",
    agencyName: "Agence Paris Centre",
    role: "manager",
    isActive: true,
    permissions: [
      { action: "create_transaction", granted: true },
      { action: "approve_transaction", granted: true },
      { action: "manage_liquidity", granted: true },
      { action: "view_reports", granted: true },
      { action: "manage_employees", granted: true }
    ],
    hireDate: new Date("2020-01-15"),
    lastLogin: new Date()
  },
  {
    id: "emp_2",
    firstName: "Pierre",
    lastName: "Martin",
    email: "pierre.martin@exchangehub.com",
    phone: "+33 1 23 45 67 90",
    agencyId: "1",
    agencyName: "Agence Paris Centre",
    role: "cashier",
    isActive: true,
    permissions: [
      { action: "create_transaction", granted: true },
      { action: "approve_transaction", granted: false },
      { action: "manage_liquidity", granted: false },
      { action: "view_reports", granted: true },
      { action: "manage_employees", granted: false }
    ],
    hireDate: new Date("2021-06-01")
  },
  {
    id: "emp_3",
    firstName: "Sophie",
    lastName: "Bernard",
    email: "sophie.bernard@exchangehub.com",
    phone: "+33 4 56 78 90 12",
    agencyId: "2",
    agencyName: "Agence Lyon",
    role: "agent",
    isActive: true,
    permissions: [
      { action: "create_transaction", granted: true },
      { action: "approve_transaction", granted: false },
      { action: "manage_liquidity", granted: false },
      { action: "view_reports", granted: false },
      { action: "manage_employees", granted: false }
    ],
    hireDate: new Date("2022-03-10")
  }
];

export function useEmployeeManager() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  const getEmployeesByAgency = (agencyId: string) => {
    return employees.filter(emp => emp.agencyId === agencyId && emp.isActive);
  };

  const getEmployeeById = (employeeId: string) => {
    return employees.find(emp => emp.id === employeeId);
  };

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: `emp_${Date.now()}`
    };
    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  };

  const updateEmployee = (employeeId: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, ...updates } : emp
    ));
  };

  const deactivateEmployee = (employeeId: string) => {
    updateEmployee(employeeId, { isActive: false });
  };

  return {
    employees,
    getEmployeesByAgency,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deactivateEmployee,
  };
}
