
import { Transaction, TransactionCategory, Agency } from '@/types/transaction';

export const defaultCategories: TransactionCategory[] = [
  { id: '1', name: 'Remittance', color: 'bg-blue-500', icon: 'Send', description: 'Envoi de fonds' },
  { id: '2', name: 'Business', color: 'bg-green-500', icon: 'Building', description: 'Transactions commerciales' },
  { id: '3', name: 'Tourism', color: 'bg-purple-500', icon: 'Plane', description: 'Change touristique' },
  { id: '4', name: 'Investment', color: 'bg-orange-500', icon: 'TrendingUp', description: 'Investissements' },
  { id: '5', name: 'Emergency', color: 'bg-red-500', icon: 'AlertTriangle', description: 'Urgences' },
  { id: '6', name: 'Education', color: 'bg-indigo-500', icon: 'GraduationCap', description: 'Frais scolaires' }
];

export const mockAgencies: Agency[] = [
  { id: '1', name: 'Agence Paris Centre', code: 'PAR01', country: 'France', isActive: true },
  { id: '2', name: 'Agence Dakar Plateau', code: 'DAK01', country: 'Sénégal', isActive: true },
  { id: '3', name: 'Agence Abidjan Cocody', code: 'ABJ01', country: 'Côte d\'Ivoire', isActive: true },
  { id: '4', name: 'Agence Bamako Centre', code: 'BKO01', country: 'Mali', isActive: true }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 500,
    fromCurrency: 'EUR',
    toCurrency: 'XOF',
    exchangeRate: 655.957,
    convertedAmount: 327978.5,
    status: 'completed',
    timestamp: new Date('2024-06-15T10:30:00'),
    agencyId: '1',
    agencyName: 'Agence Paris Centre',
    category: defaultCategories[0],
    customerName: 'Marie Dubois',
    customerPhone: '+33123456789',
    validationType: 'blocking'
  },
  {
    id: '2',
    amount: 1000,
    fromCurrency: 'XOF',
    toCurrency: 'EUR',
    exchangeRate: 0.001524,
    convertedAmount: 1.524,
    status: 'pending',
    timestamp: new Date('2024-06-15T11:15:00'),
    agencyId: '2',
    agencyName: 'Agence Dakar Plateau',
    category: defaultCategories[1],
    customerName: 'Amadou Ba',
    customerPhone: '+221771234567',
    validationType: 'warning'
  },
  {
    id: '3',
    amount: 750,
    fromCurrency: 'USD',
    toCurrency: 'XOF',
    exchangeRate: 600.5,
    convertedAmount: 450375,
    status: 'completed',
    timestamp: new Date('2024-06-15T09:45:00'),
    agencyId: '3',
    agencyName: 'Agence Abidjan Cocody',
    category: defaultCategories[2],
    customerName: 'Koffi Asante',
    validationType: 'none'
  }
];
