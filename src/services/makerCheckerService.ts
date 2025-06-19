
import { Transaction } from "@/types/transaction";
import { ApprovalRule, TransactionApproval } from "@/types/makerChecker";

// Règles d'approbation avec validation stricte
const APPROVAL_RULES: ApprovalRule[] = [
  {
    id: "rule_change_5000_eur",
    transactionType: "currency_exchange",
    maxAmount: 5000,
    currency: "EUR",
    isActive: true,
    requiredApprovalLevel: "supervisor",
    description: "Change dépassant 5000 EUR nécessite une approbation superviseur"
  },
  {
    id: "rule_transfer_10000_eur", 
    transactionType: "international_transfer",
    maxAmount: 10000,
    currency: "EUR",
    isActive: true,
    requiredApprovalLevel: "manager",
    description: "Transfert international dépassant 10000 EUR nécessite une approbation manager"
  },
  {
    id: "rule_change_2500000_xof",
    transactionType: "currency_exchange", 
    maxAmount: 2500000,
    currency: "XOF",
    isActive: true,
    requiredApprovalLevel: "supervisor",
    description: "Change dépassant 2.5M XOF nécessite une approbation superviseur"
  }
];

export class MakerCheckerService {
  /**
   * Vérifie si une transaction nécessite une approbation
   * Validation stricte des paramètres d'entrée
   */
  static checkTransactionRequiresApproval(transaction: Partial<Transaction>): {
    requiresApproval: boolean;
    rule?: ApprovalRule;
    error?: string;
  } {
    // Validation des paramètres obligatoires
    if (!transaction) {
      return { requiresApproval: false, error: "Transaction manquante" };
    }

    if (!transaction.type?.trim()) {
      return { requiresApproval: false, error: "Type de transaction manquant" };
    }

    if (!transaction.amount || transaction.amount <= 0) {
      return { requiresApproval: false, error: "Montant invalide" };
    }

    if (!transaction.fromCurrency?.trim()) {
      return { requiresApproval: false, error: "Devise source manquante" };
    }

    if (!transaction.agencyId?.trim()) {
      return { requiresApproval: false, error: "ID agence manquant" };
    }

    // Recherche des règles applicables avec validation stricte
    const applicableRules = APPROVAL_RULES.filter(rule => {
      return rule.isActive &&
             rule.transactionType === transaction.type &&
             rule.currency === transaction.fromCurrency &&
             transaction.amount! > rule.maxAmount;
    });

    if (applicableRules.length === 0) {
      return { requiresApproval: false };
    }

    // Retourner la règle la plus stricte (montant le plus bas)
    const strictestRule = applicableRules.reduce((prev, current) => 
      prev.maxAmount < current.maxAmount ? prev : current
    );

    return {
      requiresApproval: true,
      rule: strictestRule
    };
  }

  /**
   * Crée une demande d'approbation avec validation stricte
   */
  static createApprovalRequest(
    transaction: Partial<Transaction>,
    rule: ApprovalRule,
    requestedBy: string,
    requestedByName: string
  ): TransactionApproval | null {
    // Validation stricte des paramètres
    if (!transaction?.id?.trim()) {
      console.error("ID transaction manquant pour la demande d'approbation");
      return null;
    }

    if (!rule?.id?.trim()) {
      console.error("Règle d'approbation invalide");
      return null;
    }

    if (!requestedBy?.trim() || requestedBy.trim().length < 3) {
      console.error("ID du demandeur invalide");
      return null;
    }

    if (!requestedByName?.trim() || requestedByName.trim().length < 2) {
      console.error("Nom du demandeur invalide");
      return null;
    }

    // Validation de sécurité: vérifier que la transaction nécessite vraiment une approbation
    const approvalCheck = this.checkTransactionRequiresApproval(transaction);
    if (!approvalCheck.requiresApproval) {
      console.error("Tentative de création d'approbation pour une transaction qui n'en nécessite pas");
      return null;
    }

    return {
      id: `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      transactionId: transaction.id,
      ruleId: rule.id,
      status: 'pending',
      requestedBy: requestedBy.trim(),
      requestedByName: requestedByName.trim(),
      requestedAt: new Date(),
      requiredApprovalLevel: rule.requiredApprovalLevel
    };
  }

  /**
   * Obtient toutes les règles actives
   */
  static getActiveRules(): ApprovalRule[] {
    return APPROVAL_RULES.filter(rule => rule.isActive);
  }

  /**
   * Obtient une règle par son ID avec validation
   */
  static getRuleById(ruleId: string): ApprovalRule | null {
    if (!ruleId?.trim()) {
      return null;
    }
    
    return APPROVAL_RULES.find(rule => rule.id === ruleId.trim()) || null;
  }

  /**
   * Valide si un utilisateur peut approuver selon son niveau
   */
  static canUserApprove(userLevel: string, requiredLevel: string): boolean {
    const levels = ['agent', 'supervisor', 'manager', 'administrator'];
    const userLevelIndex = levels.indexOf(userLevel?.toLowerCase()?.trim() || '');
    const requiredLevelIndex = levels.indexOf(requiredLevel?.toLowerCase()?.trim() || '');
    
    return userLevelIndex >= 0 && requiredLevelIndex >= 0 && userLevelIndex >= requiredLevelIndex;
  }
}
