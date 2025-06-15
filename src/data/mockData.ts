
import { Transaction, Agency, Partner, TransactionType, CommissionTier } from "@/types/transaction";
import { Customer } from "@/types/customer";
import { v4 as uuidv4 } from 'uuid';

// Updated agencies with the specified branches
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

// Coherent set of customers with proper distribution across countries
export const mockCustomers: Customer[] = [
  // Paris customers
  { id: `cust_${uuidv4()}`, name: 'Jean Dupont', phone: '+33612345678', email: 'jean.dupont@email.com', address: '1 rue de la Paix, Paris', idNumber: '123456789', kycStatus: 'verified', riskScore: 10, lastTransactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Marie Martin', phone: '+33787654321', email: 'marie.martin@email.com', address: '2 avenue des Champs, Paris', idNumber: '987654321', kycStatus: 'pending', riskScore: 45, lastTransactionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Pierre Dubois', phone: '+33655555555', email: 'pierre.dubois@email.com', address: '5 place de la Bourse, Lyon', idNumber: '555555555', kycStatus: 'verified', riskScore: 15, lastTransactionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Sophie Lefebvre', phone: '+33698765432', email: 'sophie.l@email.com', address: '12 bd Saint-Germain, Paris', idNumber: '111222333', kycStatus: 'verified', riskScore: 20, lastTransactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  
  // Casablanca customers
  { id: `cust_${uuidv4()}`, name: 'Ahmed Ben Ali', phone: '+212612345678', email: 'ahmed.benali@email.com', address: '3 boulevard Mohammed V, Casablanca', idNumber: 'AB123456', kycStatus: 'verified', riskScore: 25, lastTransactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Fatima El Mansouri', phone: '+212661234567', email: 'fatima.m@email.com', address: '15 rue Hassan II, Casablanca', idNumber: 'FM789012', kycStatus: 'pending', riskScore: 40, lastTransactionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Mohamed Benali', phone: '+212655551234', email: 'mohamed.b@email.com', address: '8 avenue de la Liberté, Rabat', idNumber: 'MB345678', kycStatus: 'verified', riskScore: 20, lastTransactionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Aicha Zahra', phone: '+212677889900', email: 'aicha.z@email.com', address: '22 quartier Maarif, Casablanca', idNumber: 'AZ567890', kycStatus: 'verified', riskScore: 18, lastTransactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  
  // Douala customers
  { id: `cust_${uuidv4()}`, name: 'Fatou Diop', phone: '+237671234567', email: 'fatou.diop@email.com', address: '4 route de la Corniche, Douala', idNumber: 'CM987654', kycStatus: 'rejected', riskScore: 90, lastTransactionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Mamadou Ndiaye', phone: '+237695551234', email: 'mamadou.n@email.com', address: '12 avenue de la Réunification, Douala', idNumber: 'MN123456', kycStatus: 'verified', riskScore: 30, lastTransactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Aminata Sow', phone: '+237677558765', email: 'aminata.s@email.com', address: '18 rue Joss, Douala', idNumber: 'AS789012', kycStatus: 'pending', riskScore: 50, lastTransactionDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Paul Biya', phone: '+237688994455', email: 'paul.b@email.com', address: '5 quartier Bonapriso, Douala', idNumber: 'PB345678', kycStatus: 'verified', riskScore: 25, lastTransactionDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
  
  // Kigali customers
  { id: `cust_${uuidv4()}`, name: 'Grace Uwimana', phone: '+250788123456', email: 'grace.u@email.com', address: '10 KG 15 Ave, Kigali', idNumber: 'RW123456', kycStatus: 'verified', riskScore: 15, lastTransactionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Jean Baptiste Nzeyimana', phone: '+250788987654', email: 'jean.b@email.com', address: '25 KN 5 St, Kigali', idNumber: 'RW789012', kycStatus: 'pending', riskScore: 55, lastTransactionDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Alice Mukamana', phone: '+250788556677', email: 'alice.m@email.com', address: '8 KG 7 Ave, Kigali', idNumber: 'RW345678', kycStatus: 'verified', riskScore: 22, lastTransactionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
  
  // Dubai customers
  { id: `cust_${uuidv4()}`, name: 'Omar Al Maktoum', phone: '+971501234567', email: 'omar.m@email.com', address: 'Business Bay, Dubai', idNumber: 'AE123456', kycStatus: 'verified', riskScore: 12, lastTransactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Layla Hassan', phone: '+971502345678', email: 'layla.h@email.com', address: 'Jumeirah Beach Road, Dubai', idNumber: 'AE789012', kycStatus: 'verified', riskScore: 18, lastTransactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Carlos Silva', phone: '+971503456789', email: 'carlos.s@email.com', address: 'Marina District, Dubai', idNumber: 'AE345678', kycStatus: 'none', riskScore: 65, lastTransactionDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
  { id: `cust_${uuidv4()}`, name: 'Anna Kowalski', phone: '+971504567890', email: 'anna.k@email.com', address: 'Downtown Dubai', idNumber: 'AE567890', kycStatus: 'rejected', riskScore: 85, lastTransactionDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
];

const transactionTypes: TransactionType[] = [
  'internal_transfer',
  'international_transfer', 
  'currency_exchange',
  'payment'
];

const currencies = ['EUR', 'USD', 'XOF', 'MAD', 'AED', 'RWF'];

function generateCoherentTransaction(index: number): Transaction {
  const agencies = mockAgencies;
  const customers = mockCustomers;
  
  // Select transaction type with realistic distribution
  const typeWeights = [0.4, 0.3, 0.2, 0.1]; // internal_transfer, international_transfer, currency_exchange, payment
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
  
  // Select realistic currency pairs based on agency locations
  let fromCurrency, toCurrency, agency, destinationAgency;
  
  agency = agencies[Math.floor(Math.random() * agencies.length)];
  
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
  
  // Select destination currency based on transaction type and realistic flows
  if (type === 'internal_transfer') {
    destinationAgency = agencies.find(a => a.id !== agency.id) || agencies[0];
    toCurrency = fromCurrency; // Same currency for internal transfers
  } else {
    // Common currency exchange patterns
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
  
  // Generate realistic amounts based on currency and transaction type
  let amount;
  const baseAmounts = {
    "EUR": [50, 100, 250, 500, 1000, 2000],
    "USD": [60, 120, 300, 600, 1200, 2400],
    "XOF": [30000, 60000, 150000, 300000, 600000, 1200000],
    "MAD": [500, 1000, 2500, 5000, 10000, 20000],
    "AED": [200, 400, 1000, 2000, 4000, 8000],
    "RWF": [50000, 100000, 250000, 500000, 1000000, 2000000]
  };
  
  const amountChoices = baseAmounts[fromCurrency] || [100, 200, 500, 1000, 2000, 5000];
  amount = amountChoices[Math.floor(Math.random() * amountChoices.length)] + Math.floor(Math.random() * 100);
  
  // Realistic exchange rates
  const exchangeRates = {
    "EUR_XOF": 656,
    "EUR_MAD": 11,
    "EUR_USD": 1.1,
    "EUR_AED": 4,
    "EUR_RWF": 1100,
    "USD_XOF": 600,
    "USD_MAD": 10,
    "USD_AED": 3.67,
    "USD_RWF": 1000,
    "USD_EUR": 0.91
  };
  
  const rateKey = `${fromCurrency}_${toCurrency}`;
  const reverseRateKey = `${toCurrency}_${fromCurrency}`;
  let baseRate = exchangeRates[rateKey] || (exchangeRates[reverseRateKey] ? 1/exchangeRates[reverseRateKey] : 1);
  
  const spread = Math.random() * 0.02; // Spread up to 2%
  const finalRate = baseRate * (1 + spread);
  const convertedAmount = amount * finalRate;
  
  // Commission calculation
  const tier = mockCommissionTiers.find(t => 
    amount >= t.minAmount && (!t.maxAmount || amount <= t.maxAmount)
  ) || mockCommissionTiers[0];
  
  const commissionAmount = tier.fixedAmount + (amount * tier.percentage / 100);
  
  // Select customers based on agency location for more realistic relationships
  const localCustomers = customers.filter(c => {
    const customerCountry = getCustomerCountry(c.address || c.phone || "");
    return customerCountry === agency.country || Math.random() > 0.8; // 20% chance for international customers
  });
  
  const sender = localCustomers.length > 0 ? 
    localCustomers[Math.floor(Math.random() * localCustomers.length)] : 
    customers[Math.floor(Math.random() * customers.length)];
  
  let receiver = customers[Math.floor(Math.random() * customers.length)];
  while (receiver.id === sender.id) {
    receiver = customers[Math.floor(Math.random() * customers.length)];
  }
  
  const statuses = ['pending', 'completed', 'rejected', 'offline'];
  const statusWeights = [0.1, 0.8, 0.05, 0.05]; // Most transactions are completed
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

function getCustomerCountry(addressOrPhone: string): string {
  if (addressOrPhone.includes("Paris") || addressOrPhone.includes("Lyon") || addressOrPhone.includes("+33")) return "France";
  if (addressOrPhone.includes("Casablanca") || addressOrPhone.includes("Rabat") || addressOrPhone.includes("+212")) return "Maroc";
  if (addressOrPhone.includes("Douala") || addressOrPhone.includes("+237")) return "Cameroun";
  if (addressOrPhone.includes("Kigali") || addressOrPhone.includes("+250")) return "Rwanda";
  if (addressOrPhone.includes("Dubai") || addressOrPhone.includes("+971")) return "Émirats Arabes Unis";
  return "France"; // Default
}

export const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, index) => 
  generateCoherentTransaction(index)
);
