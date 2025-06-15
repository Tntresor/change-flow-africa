
import { Transaction, Agency } from "@/types/transaction";
import { Employee } from "@/types/liquidity";

// Mock data pour la validation
const mockValidAgencies: Agency[] = [
  { id: "1", name: "Agence Paris Centre", code: "PAR01", country: "France", isActive: true },
  { id: "2", name: "Agence Lyon", code: "LYO01", country: "France", isActive: true },
  { id: "3", name: "Agence Marseille", code: "MAR01", country: "France", isActive: true }
];

const mockValidEmployees: Employee[] = [
  {
    id: "emp_1",
    firstName: "Marie",
    lastName: "Dubois",
    email: "marie.dubois@company.com",
    phone: "+33123456789",
    agencyId: "1",
    agencyName: "Agence Paris Centre",
    role: "manager",
    isActive: true,
    permissions: [],
    hireDate: new Date(),
    lastLogin: new Date()
  },
  {
    id: "emp_2",
    firstName: "Jean",
    lastName: "Martin",
    email: "jean.martin@company.com",
    phone: "+33123456790",
    agencyId: "2",
    agencyName: "Agence Lyon",
    role: "agent",
    isActive: true,
    permissions: [],
    hireDate: new Date(),
    lastLogin: new Date()
  }
];

export function useTransactionValidation() {
  const validateTransaction = (transaction: Partial<Transaction>) => {
    const errors: string[] = [];

    // Vérifier que l'agence existe
    if (transaction.agencyId) {
      const agency = mockValidAgencies.find(a => a.id === transaction.agencyId && a.isActive);
      if (!agency) {
        errors.push("L'agence sélectionnée n'existe pas ou n'est pas active");
      }
    }

    // Vérifier que l'agent existe et appartient à la bonne agence
    if (transaction.agent?.id) {
      const employee = mockValidEmployees.find(e => e.id === transaction.agent?.id && e.isActive);
      if (!employee) {
        errors.push("L'agent sélectionné n'existe pas ou n'est pas actif");
      } else if (employee.agencyId !== transaction.agencyId) {
        errors.push("L'agent sélectionné n'appartient pas à l'agence choisie");
      }
    }

    // Vérifier les montants
    if (transaction.amount && transaction.amount <= 0) {
      errors.push("Le montant doit être supérieur à 0");
    }

    // Vérifier les devises
    if (transaction.fromCurrency === transaction.toCurrency) {
      errors.push("Les devises source et destination doivent être différentes");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const getValidAgencies = () => mockValidAgencies.filter(a => a.isActive);
  const getValidEmployeesByAgency = (agencyId: string) => 
    mockValidEmployees.filter(e => e.agencyId === agencyId && e.isActive);

  return {
    validateTransaction,
    getValidAgencies,
    getValidEmployeesByAgency
  };
}
