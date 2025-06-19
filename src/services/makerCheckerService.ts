
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
  },
  {
    id: "rule_3",
    agencyId: "2",
    agencyName: "Agence Douala",
    transactionType: "currency_exchange",
    currency: "XOF",
    maxAmount: 500000,
    requiresApproval: true,
    approverRoles: ["supervisor", "manager"],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export class MakerCheckerService {
  private static validateTransaction(transaction: Partial<Transaction>): boolean {
    if (!transaction.agencyId || typeof transaction.agencyId !== 'string') return false;
    if (!transaction.type || typeof transaction.type !== 'string') return false;
    if (!transaction.amount || typeof transaction.amount !== 'number' || transaction.amount <= 0) return false;
    if (!transaction.fromCurrency || typeof transaction.fromCurrency !== 'string') return false;
    return true;
  }

  private static validateApprovalRequest(
    requestedBy: string,
    requestedByName: string
  ): boolean {
    if (!requestedBy || typeof requestedBy !== 'string' || requestedBy.trim().length === 0) return false;
    if (!requestedByName || typeof requestedByName !== 'string' || requestedByName.trim().length === 0) return false;
    return true;
  }

  static getRulesByAgency(agencyId: string): MakerCheckerRule[] {
    if (!agencyId || typeof agencyId !== 'string') {
      console.warn('MakerCheckerService: Invalid agencyId provided');
      return [];
    }

    return mockMakerCheckerRules.filter(rule => 
      rule.agencyId === agencyId && rule.isActive
    );
  }

  static checkTransactionRequiresApproval(
    transaction: Partial<Transaction>
  ): { requiresApproval: boolean; rule?: MakerCheckerRule; error?: string } {
    if (!this.validateTransaction(transaction)) {
      return { 
        requiresApproval: false, 
        error: "Transaction invalide - données manquantes ou incorrectes" 
      };
    }

    try {
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
    } catch (error) {
      console.error('Error checking transaction approval requirements:', error);
      return { 
        requiresApproval: false, 
        error: "Erreur lors de la vérification des règles d'approbation" 
      };
    }
  }

  static createApprovalRequest(
    transaction: Partial<Transaction>,
    rule: MakerCheckerRule,
    requestedBy: string,
    requestedByName: string
  ): TransactionApproval | null {
    if (!this.validateApprovalRequest(requestedBy, requestedByName)) {
      console.error('Invalid approval request data');
      return null;
    }

    if (!transaction.id && !transaction.amount && !transaction.type) {
      console.error('Invalid transaction data for approval request');
      return null;
    }

    try {
      return {
        id: `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        transactionId: transaction.id || `temp_${Date.now()}`,
        requestedBy: requestedBy.trim(),
        requestedByName: requestedByName.trim(),
        requestedAt: new Date(),
        status: 'pending'
      };
    } catch (error) {
      console.error('Error creating approval request:', error);
      return null;
    }
  }

  static canUserApprove(userRole: string, rule: MakerCheckerRule): boolean {
    if (!userRole || typeof userRole !== 'string') return false;
    if (!rule || !rule.approverRoles) return false;
    
    return rule.approverRoles.includes(userRole as any);
  }
}
