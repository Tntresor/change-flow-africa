
import { useState } from "react";
import { Employee } from "@/types/liquidity";
import { mockAgencies } from "@/data/mockData";

const mockEmployees: Employee[] = [
  {
    id: "emp_1",
    firstName: "Marie",
    lastName: "Dubois",
    email: "marie.dubois@exchangehub.com",
    phone: "+33 1 23 45 67 89",
    agencyId: "1",
    agencyName: "Agence Paris",
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
    agencyName: "Agence Paris",
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
    firstName: "Fatou",
    lastName: "Diop",
    email: "fatou.diop@exchangehub.com",
    phone: "+237 671 234 567",
    agencyId: "2",
    agencyName: "Agence Douala",
    role: "manager",
    isActive: true,
    permissions: [
      { action: "create_transaction", granted: true },
      { action: "approve_transaction", granted: true },
      { action: "manage_liquidity", granted: true },
      { action: "view_reports", granted: true },
      { action: "manage_employees", granted: true }
    ],
    hireDate: new Date("2021-03-10"),
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: "emp_4",
    firstName: "Ahmed",
    lastName: "El Fassi",
    email: "ahmed.elfassi@exchangehub.com",
    phone: "+212 522 123 456",
    agencyId: "3",
    agencyName: "Agence Casablanca",
    role: "manager",
    isActive: true,
    permissions: [
      { action: "create_transaction", granted: true },
      { action: "approve_transaction", granted: true },
      { action: "manage_liquidity", granted: true },
      { action: "view_reports", granted: true },
      { action: "manage_employees", granted: true }
    ],
    hireDate: new Date("2019-09-01"),
    lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: "emp_5",
    firstName: "Grace",
    lastName: "Uwimana",
    email: "grace.uwimana@exchangehub.com",
    phone: "+250 788 123 456",
    agencyId: "4",
    agencyName: "Agence Kigali",
    role: "manager",
    isActive: true,
    permissions: [
      { action: "create_transaction", granted: true },
      { action: "approve_transaction", granted: true },
      { action: "manage_liquidity", granted: true },
      { action: "view_reports", granted: true },
      { action: "manage_employees", granted: true }
    ],
    hireDate: new Date("2020-07-15"),
    lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: "emp_6",
    firstName: "Omar",
    lastName: "Al Maktoum",
    email: "omar.almaktoum@exchangehub.com",
    phone: "+971 50 123 4567",
    agencyId: "5",
    agencyName: "Agence Dubai",
    role: "manager",
    isActive: true,
    permissions: [
      { action: "create_transaction", granted: true },
      { action: "approve_transaction", granted: true },
      { action: "manage_liquidity", granted: true },
      { action: "view_reports", granted: true },
      { action: "manage_employees", granted: true }
    ],
    hireDate: new Date("2021-11-01"),
    lastLogin: new Date()
  },
  {
    id: "emp_7",
    firstName: "Aminata",
    lastName: "Sow",
    email: "aminata.sow@exchangehub.com",
    phone: "+237 677 558 765",
    agencyId: "2",
    agencyName: "Agence Douala",
    role: "cashier",
    isActive: true,
    permissions: [
      { action: "create_transaction", granted: true },
      { action: "approve_transaction", granted: false },
      { action: "manage_liquidity", granted: false },
      { action: "view_reports", granted: true },
      { action: "manage_employees", granted: false }
    ],
    hireDate: new Date("2022-05-15")
  },
  {
    id: "emp_8",
    firstName: "Layla",
    lastName: "Hassan",
    email: "layla.hassan@exchangehub.com",
    phone: "+971 502 345 678",
    agencyId: "5",
    agencyName: "Agence Dubai",
    role: "agent",
    isActive: true,
    permissions: [
      { action: "create_transaction", granted: true },
      { action: "approve_transaction", granted: false },
      { action: "manage_liquidity", granted: false },
      { action: "view_reports", granted: false },
      { action: "manage_employees", granted: false }
    ],
    hireDate: new Date("2023-01-10")
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
