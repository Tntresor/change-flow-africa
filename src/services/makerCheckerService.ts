
import { MakerCheckerRule, TransactionApproval, PendingTransaction } from "@/types/makerChecker";
import { Transaction } from "@/types/transaction";

// Mock data pour les règles maker-checker
const mockMakerCheckerRules: MakerCheckerRule[] = [
  {
    id: "rule_1",
    agencyId: "1",
    agencyName: "Agence Paris Centre",
    transactionType: "currency_exchange",
    currency: "EUR",
    maxAmount: 5000,
    requiresApproval: true,
    approverRoles: ["supervisor", "manager"],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "rule_2",
    agencyId: "1",
    agencyName: "Agence Paris Centre",
    transactionType: "international_transfer",
    currency: "XOF",
    maxAmount: 1000000,
    requiresApproval: true,
    approverRoles: ["manager", "administrator"],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export class MakerCheckerService {
  static getRulesByAgency(agencyId: string): MakerCheckerRule[] {
    return mockMakerCheckerRules.filter(rule => 
      rule.agencyId === agencyId && rule.isActive
    );
  }

  static checkTransactionRequiresApproval(
    transaction: Partial<Transaction>
  ): { requiresApproval: boolean; rule?: MakerCheckerRule } {
    if (!transaction.agencyId || !transaction.type || !transaction.amount || !transaction.fromCurrency) {
      return { requiresApproval: false };
    }

    const applicableRule = mockMakerCheckerRules.find(rule =>
      rule.agencyId === transaction.agencyId &&
      rule.transactionType === transaction.type &&
      rule.currency === transaction.fromCurrency &&
      rule.isActive &&
      transaction.amount! > rule.maxAmount
    );

    return {
      requiresApproval: !!applicableRule,
      rule: applicableRule
    };
  }

  static createApprovalRequest(
    transaction: Partial<Transaction>,
    rule: MakerCheckerRule,
    requestedBy: string,
    requestedByName: string
  ): TransactionApproval {
    return {
      id: `approval_${Date.now()}`,
      transactionId: transaction.id || `temp_${Date.now()}`,
      requestedBy,
      requestedByName,
      requestedAt: new Date(),
      status: 'pending'
    };
  }

  static canUserApprove(userRole: string, rule: MakerCheckerRule): boolean {
    return rule.approverRoles.includes(userRole as any);
  }
}
