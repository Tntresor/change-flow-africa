import { Transaction, Agency, Partner, TransactionType, CommissionTier } from "@/types/transaction";
import { Customer } from "@/types/customer";
import { v4 as uuidv4 } from 'uuid';

// Agences cohérentes avec les données de liquidité
export const mockAgencies: Agency[] = [
  { id: "1", name: "Agence Paris", code: "PAR01", country: "France", isActive: true },
  { id: "2", name: "Agence Douala", code: "DLA01", country: "Cameroun", isActive: true },
  { id: "3", name: "Agence Casablanca", code: "CAS01", country: "Maroc", isActive: true },
  { id: "4", name: "Agence Kigali", code: "KGL01", country: "Rwanda", isActive: true },
  { id: "5", name: "Agence Dubai", code: "DXB01", country: "Émirats Arabes Unis", isActive: true },
];

export const mockPartners: Partner[] = [
  { id: "p1", name: "Western Union", country: "Global", type: "money_transfer", isActive: true },
  { id: "p2", name: "MoneyGram", country: "Global", type: "money_transfer", isActive: true },
  { id: "p3", name: "Banque Populaire Maroc", country: "Maroc", type: "bank", isActive: true },
  { id: "p4", name: "Orange Money", country: "Cameroun", type: "mobile_wallet", isActive: true },
  { id: "p5", name: "Bank of Kigali", country: "Rwanda", type: "bank", isActive: true },
  { id: "p6", name: "Emirates NBD", country: "Émirats Arabes Unis", type: "bank", isActive: true },
];

export const mockCommissionTiers: CommissionTier[] = [
  { id: "t1", name: "Palier 1", minAmount: 0, maxAmount: 100, fixedAmount: 2, percentage: 1.5 },
  { id: "t2", name: "Palier 2", minAmount: 100, maxAmount: 500, fixedAmount: 5, percentage: 1.2 },
  { id: "t3", name: "Palier 3", minAmount: 500, maxAmount: 1000, fixedAmount: 8, percentage: 1.0 },
  { id: "t4", name: "Palier 4", minAmount: 1000, fixedAmount: 15, percentage: 0.8 },
];

// Clients cohérents avec répartition par pays
export const mockCustomers: Customer[] = [
  // Paris customers
  { id: `cust_${uuidv4()}`, name: 'Jean Dupont', phone: '+33612345678', email: 'jean.dupont@email.com', address: '1 rue de la Paix, Paris', idNumber: '123456789', kycStatus: 'verified', riskScore: 10, lastTransactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Marie Martin', phone: '+33787654321', email: 'marie.martin@email.com', address: '2 avenue des Champs, Paris', idNumber: '987654321', kycStatus: 'pending', riskScore: 45, lastTransactionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  
  // Casablanca customers
  { id: `cust_${uuidv4()}`, name: 'Ahmed Ben Ali', phone: '+212612345678', email: 'ahmed.benali@email.com', address: '3 boulevard Mohammed V, Casablanca', idNumber: 'AB123456', kycStatus: 'verified', riskScore: 25, lastTransactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Fatima El Mansouri', phone: '+212661234567', email: 'fatima.m@email.com', address: '15 rue Hassan II, Casablanca', idNumber: 'FM789012', kycStatus: 'pending', riskScore: 40, lastTransactionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  
  // Douala customers
  { id: `cust_${uuidv4()}`, name: 'Fatou Diop', phone: '+237671234567', email: 'fatou.diop@email.com', address: '4 route de la Corniche, Douala', idNumber: 'CM987654', kycStatus: 'rejected', riskScore: 90, lastTransactionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Mamadou Ndiaye', phone: '+237695551234', email: 'mamadou.n@email.com', address: '12 avenue de la Réunification, Douala', idNumber: 'MN123456', kycStatus: 'verified', riskScore: 30, lastTransactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  
  // Kigali customers
  { id: `cust_${uuidv4()}`, name: 'Grace Uwimana', phone: '+250788123456', email: 'grace.u@email.com', address: '10 KG 15 Ave, Kigali', idNumber: 'RW123456', kycStatus: 'verified', riskScore: 15, lastTransactionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Jean Baptiste Nzeyimana', phone: '+250788987654', email: 'jean.b@email.com', address: '25 KN 5 St, Kigali', idNumber: 'RW789012', kycStatus: 'pending', riskScore: 55, lastTransactionDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
  
  // Dubai customers
  { id: `cust_${uuidv4()}`, name: 'Omar Al Maktoum', phone: '+971501234567', email: 'omar.m@email.com', address: 'Business Bay, Dubai', idNumber: 'AE123456', kycStatus: 'verified', riskScore: 12, lastTransactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Layla Hassan', phone: '+971502345678', email: 'layla.h@email.com', address: 'Jumeirah Beach Road, Dubai', idNumber: 'AE789012', kycStatus: 'verified', riskScore: 18, lastTransactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
];

// Opérations de liquidité (Cash In/Out)
export interface LiquidityOperation {
  id: string;
  agencyId: string;
  agencyName: string;
  type: 'cash_in' | 'cash_out';
  currency: string;
  amount: number;
  timestamp: Date;
  reference: string;
  initiatedBy: string;
  status: 'pending' | 'completed' | 'rejected';
}

export const mockLiquidityOperations: LiquidityOperation[] = [
  {
    id: 'liq_op_1',
    agencyId: '1',
    agencyName: 'Agence Paris',
    type: 'cash_in',
    currency: 'EUR',
    amount: 50000.00,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    reference: 'CASHIN-PAR01-001',
    initiatedBy: 'emp_1',
    status: 'completed'
  },
  {
    id: 'liq_op_2',
    agencyId: '2',
    agencyName: 'Agence Douala',
    type: 'cash_out',
    currency: 'XOF',
    amount: 15000000.00,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    reference: 'CASHOUT-DLA01-001',
    initiatedBy: 'emp_3',
    status: 'completed'
  },
  {
    id: 'liq_op_3',
    agencyId: '3',
    agencyName: 'Agence Casablanca',
    type: 'cash_in',
    currency: 'MAD',
    amount: 100000.00,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    reference: 'CASHIN-CAS01-001',
    initiatedBy: 'emp_4',
    status: 'completed'
  }
];

const transactionTypes: TransactionType[] = [
  'internal_transfer',
  'international_transfer', 
  'currency_exchange',
  'payment'
];

const currencies = ['EUR', 'USD', 'XOF', 'MAD', 'AED', 'RWF'];

// Fonction d'aide pour formater les montants de manière cohérente
export const formatAmount = (amount: number, currency: string): string => {
  // Gestion spéciale pour certaines devises
  const currencySymbols: { [key: string]: string } = {
    'EUR': '€',
    'USD': '$',
    'XOF': 'F CFA',
    'MAD': 'DH',
    'AED': 'د.إ',
    'RWF': 'RF',
    'GBP': '£',
    'CAD': 'C$'
  };

  const symbol = currencySymbols[currency] || currency;
  
  // Format français pour les nombres
  const formattedNumber = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  // Retourner le montant formaté avec la devise
  return `${formattedNumber} ${symbol}`;
};

function generateCoherentTransaction(index: number): Transaction {
  const agencies = mockAgencies;
  const customers = mockCustomers;
  
  const typeWeights = [0.4, 0.3, 0.2, 0.1];
  let typeIndex = 0;
  const random = Math.random();
  let cumulative = 0;
  for (let i = 0; i < typeWeights.length; i++) {
    cumulative += typeWeights[i];
    if (random < cumulative) {
      typeIndex = i;
      break;
    }
  }
  const type = transactionTypes[typeIndex];
  
  const agency = agencies[Math.floor(Math.random() * agencies.length)];
  let fromCurrency, toCurrency, destinationAgency;
  
  // Détermination des devises en fonction du pays de l'agence
  switch (agency.country) {
    case "France":
      fromCurrency = Math.random() > 0.3 ? "EUR" : "USD";
      break;
    case "Maroc":
      fromCurrency = Math.random() > 0.4 ? "MAD" : "EUR";
      break;
    case "Cameroun":
      fromCurrency = Math.random() > 0.3 ? "XOF" : "EUR";
      break;
    case "Rwanda":
      fromCurrency = Math.random() > 0.4 ? "RWF" : "USD";
      break;
    case "Émirats Arabes Unis":
      fromCurrency = Math.random() > 0.3 ? "AED" : "USD";
      break;
    default:
      fromCurrency = "EUR";
  }
  
  if (type === 'internal_transfer') {
    destinationAgency = agencies.find(a => a.id !== agency.id) || agencies[0];
    toCurrency = fromCurrency;
  } else {
    const exchangePatterns = {
      "EUR": ["XOF", "MAD", "USD"],
      "USD": ["AED", "RWF", "EUR"],
      "XOF": ["EUR", "USD"],
      "MAD": ["EUR", "USD"],
      "AED": ["USD", "EUR"],
      "RWF": ["USD", "EUR"]
    };
    
    const possibleTo = exchangePatterns[fromCurrency] || ["EUR"];
    toCurrency = possibleTo[Math.floor(Math.random() * possibleTo.length)];
    destinationAgency = agencies.find(a => a.id !== agency.id) || agencies[0];
  }
  
  // Montants cohérents et formatés
  const baseAmounts = {
    "EUR": [100.00, 250.00, 500.00, 1000.00, 2500.00],
    "USD": [120.00, 300.00, 600.00, 1200.00, 3000.00],
    "XOF": [65000.00, 160000.00, 320000.00, 650000.00, 1600000.00],
    "MAD": [1000.00, 2500.00, 5000.00, 10000.00, 25000.00],
    "AED": [400.00, 1000.00, 2000.00, 4000.00, 10000.00],
    "RWF": [100000.00, 250000.00, 500000.00, 1000000.00, 2500000.00]
  };
  
  const amountChoices = baseAmounts[fromCurrency] || [100.00, 250.00, 500.00, 1000.00, 2500.00];
  const amount = amountChoices[Math.floor(Math.random() * amountChoices.length)];
  
  // Taux de change réalistes
  const exchangeRates = {
    "EUR_XOF": 656.95,
    "EUR_MAD": 11.20,
    "EUR_USD": 1.10,
    "EUR_AED": 4.00,
    "EUR_RWF": 1100.00,
    "USD_XOF": 600.50,
    "USD_MAD": 10.20,
    "USD_AED": 3.67,
    "USD_RWF": 1000.00
  };
  
  const rateKey = `${fromCurrency}_${toCurrency}`;
  const reverseRateKey = `${toCurrency}_${fromCurrency}`;
  let baseRate = exchangeRates[rateKey] || (exchangeRates[reverseRateKey] ? 1/exchangeRates[reverseRateKey] : 1);
  
  const spread = Math.random() * 0.02;
  const finalRate = baseRate * (1 + spread);
  const convertedAmount = parseFloat((amount * finalRate).toFixed(2));
  
  const tier = mockCommissionTiers.find(t => 
    amount >= t.minAmount && (!t.maxAmount || amount <= t.maxAmount)
  ) || mockCommissionTiers[0];
  
  const commissionAmount = parseFloat((tier.fixedAmount + (amount * tier.percentage / 100)).toFixed(2));
  
  const localCustomers = customers.filter(c => {
    const customerCountry = getCustomerCountry(c.address || c.phone || "");
    return customerCountry === agency.country || Math.random() > 0.8;
  });
  
  const sender = localCustomers.length > 0 ? 
    localCustomers[Math.floor(Math.random() * localCustomers.length)] : 
    customers[Math.floor(Math.random() * customers.length)];
  
  let receiver = customers[Math.floor(Math.random() * customers.length)];
  while (receiver.id === sender.id) {
    receiver = customers[Math.floor(Math.random() * customers.length)];
  }
  
  const statuses = ['pending', 'completed', 'rejected', 'offline'];
  const statusWeights = [0.1, 0.8, 0.05, 0.05];
  let statusIndex = 0;
  const statusRandom = Math.random();
  let statusCumulative = 0;
  for (let i = 0; i < statusWeights.length; i++) {
    statusCumulative += statusWeights[i];
    if (statusRandom < statusCumulative) {
      statusIndex = i;
      break;
    }
  }
  const status = statuses[statusIndex] as any;
  
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
      destination = {
        type: 'agency' as const,
        id: destinationAgency.id,
        name: destinationAgency.name,
        country: destinationAgency.country,
        code: destinationAgency.code
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
      const partner = mockPartners[Math.floor(Math.random() * mockPartners.length)];
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
  
  return {
    id: `txn_${Date.now()}_${index}`,
    type,
    amount: parseFloat(amount.toFixed(2)),
    fromCurrency,
    toCurrency,
    exchangeRate: parseFloat(baseRate.toFixed(4)),
    spread: parseFloat(spread.toFixed(4)),
    finalRate: parseFloat(finalRate.toFixed(4)),
    convertedAmount: parseFloat(convertedAmount.toFixed(2)),
    commission: {
      amount: parseFloat(tier.fixedAmount.toFixed(2)),
      percentage: tier.percentage,
      tier,
      totalCommission: parseFloat(commissionAmount.toFixed(2))
    },
    fees: parseFloat((Math.floor(Math.random() * 10) + 2).toFixed(2)),
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

function getCustomerCountry(addressOrPhone: string): string {
  if (addressOrPhone.includes("Paris") || addressOrPhone.includes("Lyon") || addressOrPhone.includes("+33")) return "France";
  if (addressOrPhone.includes("Casablanca") || addressOrPhone.includes("Rabat") || addressOrPhone.includes("+212")) return "Maroc";
  if (addressOrPhone.includes("Douala") || addressOrPhone.includes("+237")) return "Cameroun";
  if (addressOrPhone.includes("Kigali") || addressOrPhone.includes("+250")) return "Rwanda";
  if (addressOrPhone.includes("Dubai") || addressOrPhone.includes("+971")) return "Émirats Arabes Unis";
  return "France";
}

export const mockTransactions: Transaction[] = Array.from({ length: 75 }, (_, index) => 
  generateCoherentTransaction(index)
);
