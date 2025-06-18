
import { ThirdPartyFeeSettings, TransactionCostBreakdown } from "@/types/transactionCost";

// Données de test pour les frais tiers
export const mockThirdPartyFees: ThirdPartyFeeSettings[] = [
  {
    id: "fee_swift_001",
    name: "Frais SWIFT Standard",
    type: "fixed",
    fixedAmount: 15.00,
    currency: "EUR",
    isActive: true,
    transactionType: "international_transfer",
    description: "Frais de transfert SWIFT standard pour les virements internationaux"
  },
  {
    id: "fee_change_001",
    name: "Commission de change",
    type: "percentage", 
    percentage: 0.25,
    currency: "EUR",
    isActive: true,
    transactionType: "currency_exchange",
    description: "Commission appliquée sur les opérations de change"
  },
  {
    id: "fee_correspondent_001",
    name: "Frais banque correspondante",
    type: "mixed",
    fixedAmount: 5.00,
    percentage: 0.1,
    currency: "EUR",
    isActive: true,
    transactionType: "international_transfer",
    description: "Frais de la banque correspondante (partie fixe + variable)"
  },
  {
    id: "fee_compliance_001",
    name: "Frais de conformité",
    type: "fixed",
    fixedAmount: 2.50,
    currency: "EUR", 
    isActive: true,
    transactionType: "all",
    description: "Frais de vérification et contrôle de conformité"
  },
  {
    id: "fee_urgency_001",
    name: "Frais d'urgence",
    type: "percentage",
    percentage: 0.5,
    currency: "EUR",
    isActive: false,
    transactionType: "international_transfer",
    description: "Supplément pour traitement urgent (actuellement désactivé)"
  },
  {
    id: "fee_clearing_001",
    name: "Frais de clearing",
    type: "fixed",
    fixedAmount: 3.00,
    currency: "EUR",
    isActive: true,
    transactionType: "currency_exchange",
    description: "Frais de compensation et règlement"
  }
];

// Exemples de calculs de coûts
export const mockTransactionCostBreakdowns: TransactionCostBreakdown[] = [
  {
    thirdPartyCapital: 1085.00, // 1000 EUR * 1.085 (taux USD)
    fixedFees: 22.50, // 15 (SWIFT) + 5 (correspondante) + 2.50 (conformité)
    variableFees: 3.50, // 2.50 (change 0.25%) + 1.00 (correspondante 0.1%)
    totalThirdPartyCost: 1111.00,
    feeDetails: [
      {
        feeId: "fee_swift_001",
        feeName: "Frais SWIFT Standard", 
        type: "fixed",
        appliedAmount: 15.00
      },
      {
        feeId: "fee_change_001",
        feeName: "Commission de change",
        type: "percentage",
        appliedAmount: 2.50,
        calculationBase: 1000
      },
      {
        feeId: "fee_correspondent_001",
        feeName: "Frais banque correspondante",
        type: "mixed",
        appliedAmount: 6.00, // 5 fixe + 1 variable
        calculationBase: 1000
      },
      {
        feeId: "fee_compliance_001",
        feeName: "Frais de conformité",
        type: "fixed", 
        appliedAmount: 2.50
      }
    ]
  },
  {
    thirdPartyCapital: 542.50, // 500 EUR * 1.085 (taux USD)
    fixedFees: 20.50, // 15 (SWIFT) + 3 (clearing) + 2.50 (conformité)
    variableFees: 1.75, // 1.25 (change 0.25%) + 0.50 (correspondante 0.1%)
    totalThirdPartyCost: 564.75,
    feeDetails: [
      {
        feeId: "fee_swift_001",
        feeName: "Frais SWIFT Standard",
        type: "fixed",
        appliedAmount: 15.00
      },
      {
        feeId: "fee_change_001",
        feeName: "Commission de change",
        type: "percentage",
        appliedAmount: 1.25,
        calculationBase: 500
      },
      {
        feeId: "fee_clearing_001",
        feeName: "Frais de clearing",
        type: "fixed",
        appliedAmount: 3.00
      },
      {
        feeId: "fee_compliance_001",
        feeName: "Frais de conformité",
        type: "fixed",
        appliedAmount: 2.50
      },
      {
        feeId: "fee_correspondent_001",
        feeName: "Frais banque correspondante",
        type: "mixed",
        appliedAmount: 5.50, // 5 fixe + 0.5 variable
        calculationBase: 500
      }
    ]
  }
];
