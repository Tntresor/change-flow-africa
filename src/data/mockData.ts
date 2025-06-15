
import { Transaction, Agency, Partner, TransactionType, CommissionTier } from "@/types/transaction";

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
  
  const senderNames = ['Jean Dupont', 'Marie Martin', 'Ahmed Ben Ali', 'Fatou Diop', 'Pierre Dubois'];
  const receiverNames = ['Alice Johnson', 'Mohamed Benali', 'Aminata Sow', 'Carlos Silva', 'Anna Kowalski'];
  
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
      name: senderNames[Math.floor(Math.random() * senderNames.length)],
      phone: `+33 ${Math.floor(Math.random() * 900000000) + 100000000}`,
      email: `sender${index}@email.com`
    },
    receiver: {
      name: receiverNames[Math.floor(Math.random() * receiverNames.length)],
      phone: `+${Math.floor(Math.random() * 900000000) + 100000000}`,
      email: `receiver${index}@email.com`
    },
    validationType: ['blocking', 'warning', 'none'][Math.floor(Math.random() * 3)] as any,
    prefixId: `${agency.code}_${Date.now().toString().slice(-6)}`,
  };
}

export const mockTransactions: Transaction[] = Array.from({ length: 25 }, (_, index) => 
  generateRandomTransaction(index)
);
