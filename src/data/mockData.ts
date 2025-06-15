
import { Transaction, Agency, Partner, TransactionType, CommissionTier } from "@/types/transaction";
import { Customer } from "@/types/customer";
import { v4 as uuidv4 } from 'uuid';

export const mockCustomers: Customer[] = [
    { id: `cust_${uuidv4()}`, name: 'Jean Dupont', phone: '+33612345678', email: 'jean.dupont@email.com', address: '1 rue de la Paix, Paris', idNumber: '123456789', kycStatus: 'verified', riskScore: 10, lastTransactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: `cust_${uuidv4()}`, name: 'Marie Martin', phone: '+33787654321', email: 'marie.martin@email.com', address: '2 avenue des Champs, Paris', idNumber: '987654321', kycStatus: 'pending', riskScore: 45, lastTransactionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { id: `cust_${uuidv4()}`, name: 'Ahmed Ben Ali', phone: '+212612345678', email: 'ahmed.benali@email.com', address: '3 boulevard Mohammed V, Casablanca', idNumber: 'AB123456', kycStatus: 'verified', riskScore: 25, lastTransactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: `cust_${uuidv4()}`, name: 'Fatou Diop', phone: '+221771234567', email: 'fatou.diop@email.com', address: '4 route de la Corniche, Dakar', idNumber: 'SN987654', kycStatus: 'rejected', riskScore: 90, lastTransactionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    { id: `cust_${uuidv4()}`, name: 'Pierre Dubois', phone: '+33655555555', email: 'pierre.dubois@email.com', address: '5 place de la Bourse, Lyon', idNumber: '555555555', kycStatus: 'none', riskScore: 70, lastTransactionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
    { id: `cust_${uuidv4()}`, name: 'Alice Johnson', phone: '+14155552671', email: 'alice.j@email.com', kycStatus: 'verified', riskScore: 15, lastTransactionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: `cust_${uuidv4()}`, name: 'Mohamed Benali', phone: '+212655551234', email: 'mohamed.b@email.com', kycStatus: 'verified', riskScore: 20, lastTransactionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
    { id: `cust_${uuidv4()}`, name: 'Aminata Sow', phone: '+221775558765', email: 'aminata.s@email.com', kycStatus: 'pending', riskScore: 50, lastTransactionDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
    { id: `cust_${uuidv4()}`, name: 'Carlos Silva', phone: '+351912345678', email: 'carlos.s@email.com', kycStatus: 'none', riskScore: 65, lastTransactionDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
    { id: `cust_${uuidv4()}`, name: 'Anna Kowalski', phone: '+48501234567', email: 'anna.k@email.com', kycStatus: 'rejected', riskScore: 85, lastTransactionDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) }
];

export const mockAgencies: Agency[] = [
  { id: "1", name: "Agence Paris Centre", code: "PAR01", country: "France", isActive: true },
  { id: "2", name: "Agence Lyon", code: "LYO01", country: "France", isActive: true },
  { id: "3", name: "Agence Marseille", code: "MAR01", country: "France", isActive: true },
  { id: "4", name: "Agence Casablanca", code: "CAS01", country: "Maroc", isActive: true },
  { id: "5", name: "Agence Dakar", code: "DAK01", country: "Sénégal", isActive: true },
];

export const mockPartners: Partner[] = [
  { id: "p1", name: "Western Union", country: "Global", type: "money_transfer", isActive: true },
  { id: "p2", name: "MoneyGram", country: "Global", type: "money_transfer", isActive: true },
  { id: "p3", name: "Banque Populaire Maroc", country: "Maroc", type: "bank", isActive: true },
  { id: "p4", name: "Orange Money", country: "Sénégal", type: "mobile_wallet", isActive: true },
];

export const mockCommissionTiers: CommissionTier[] = [
  { id: "t1", name: "Palier 1", minAmount: 0, maxAmount: 100, fixedAmount: 2, percentage: 1.5 },
  { id: "t2", name: "Palier 2", minAmount: 100, maxAmount: 500, fixedAmount: 5, percentage: 1.2 },
  { id: "t3", name: "Palier 3", minAmount: 500, maxAmount: 1000, fixedAmount: 8, percentage: 1.0 },
  { id: "t4", name: "Palier 4", minAmount: 1000, fixedAmount: 15, percentage: 0.8 },
];

const transactionTypes: TransactionType[] = [
  'internal_transfer',
  'international_transfer', 
  'currency_exchange',
  'payment'
];

const currencies = ['EUR', 'USD', 'XOF', 'MAD', 'GBP'];

function generateRandomTransaction(index: number): Transaction {
  const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
  const fromCurrency = currencies[Math.floor(Math.random() * currencies.length)];
  let toCurrency = currencies[Math.floor(Math.random() * currencies.length)];
  while (toCurrency === fromCurrency) {
    toCurrency = currencies[Math.floor(Math.random() * currencies.length)];
  }
  
  const amount = Math.floor(Math.random() * 2000) + 50;
  const baseRate = Math.random() * 2 + 0.5;
  const spread = Math.random() * 0.02; // Spread jusqu'à 2%
  const finalRate = baseRate + spread;
  const convertedAmount = amount * finalRate;
  
  // Calcul des commissions par palier
  const tier = mockCommissionTiers.find(t => 
    amount >= t.minAmount && (!t.maxAmount || amount <= t.maxAmount)
  ) || mockCommissionTiers[0];
  
  const commissionAmount = tier.fixedAmount + (amount * tier.percentage / 100);
  
  const agency = mockAgencies[Math.floor(Math.random() * mockAgencies.length)];
  const partner = mockPartners[Math.floor(Math.random() * mockPartners.length)];
  
  let origin, destination;
  
  switch (type) {
    case 'internal_transfer':
      origin = {
        type: 'agency' as const,
        id: agency.id,
        name: agency.name,
        country: agency.country,
        code: agency.code
      };
      const destAgency = mockAgencies.find(a => a.id !== agency.id) || mockAgencies[0];
      destination = {
        type: 'agency' as const,
        id: destAgency.id,
        name: destAgency.name,
        country: destAgency.country,
        code: destAgency.code
      };
      break;
      
    case 'international_transfer':
      origin = {
        type: 'agency' as const,
        id: agency.id,
        name: agency.name,
        country: agency.country,
        code: agency.code
      };
      destination = {
        type: 'partner' as const,
        id: partner.id,
        name: partner.name,
        country: partner.country
      };
      break;
      
    default:
      origin = {
        type: 'agency' as const,
        id: agency.id,
        name: agency.name,
        country: agency.country,
        code: agency.code
      };
      destination = {
        type: 'agency' as const,
        id: agency.id,
        name: agency.name,
        country: agency.country,
        code: agency.code
      };
  }

  const status = ['pending', 'completed', 'rejected', 'offline'][Math.floor(Math.random() * 4)] as any;
  
  const sender = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
  let receiver = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
  while (receiver.id === sender.id) {
    receiver = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
  }
  
  return {
    id: `txn_${Date.now()}_${index}`,
    type,
    amount,
    fromCurrency,
    toCurrency,
    exchangeRate: baseRate,
    spread,
    finalRate,
    convertedAmount,
    commission: {
      amount: tier.fixedAmount,
      percentage: tier.percentage,
      tier,
      totalCommission: commissionAmount
    },
    fees: Math.floor(Math.random() * 10) + 2,
    status,
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    agencyId: agency.id,
    agencyName: agency.name,
    origin,
    destination,
    sender: {
      id: sender.id,
      name: sender.name,
      phone: sender.phone,
      email: sender.email
    },
    receiver: {
      id: receiver.id,
      name: receiver.name,
      phone: receiver.phone,
      email: receiver.email
    },
    validationType: ['blocking', 'warning', 'none'][Math.floor(Math.random() * 3)] as any,
    prefixId: `${agency.code}_${Date.now().toString().slice(-6)}`,
  };
}

export const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, index) => 
  generateRandomTransaction(index)
);
