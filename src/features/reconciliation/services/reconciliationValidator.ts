
export class ReconciliationValidator {
  /**
   * Valide les données de réconciliation
   */
  static validateReconciliationData(
    agentId: string,
    tillId: string,
    currency: string,
    actualCash: number
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!agentId) {
      errors.push("L'identifiant de l'agent est obligatoire");
    }

    if (!tillId) {
      errors.push("L'identifiant de la caisse est obligatoire");
    }

    if (!currency) {
      errors.push("La devise est obligatoire");
    }

    if (actualCash < 0) {
      errors.push("Le montant cash ne peut pas être négatif");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
