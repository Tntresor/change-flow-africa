
import { CommissionTierSettings } from "@/types/rates";

interface CommissionTierDetailsProps {
  tier: CommissionTierSettings;
}

const calculateCommission = (amount: number, tier: CommissionTierSettings) => {
  switch (tier.type) {
    case 'percentage':
      return amount * tier.percentage / 100;
    case 'fixed':
      return tier.fixedAmount;
    case 'percentage_plus_fixed':
      return (amount * tier.percentage / 100) + tier.fixedAmount;
    case 'percentage_with_minimum':
      const percentageAmount = amount * tier.percentage / 100;
      return Math.max(percentageAmount, tier.fixedAmount);
    default:
      return 0;
  }
};

export function CommissionTierDetails({ tier }: CommissionTierDetailsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Montant min:</span>
          <div className="font-semibold">{tier.minAmount}€</div>
        </div>
        <div>
          <span className="text-gray-500">Montant max:</span>
          <div className="font-semibold">{tier.maxAmount ? `${tier.maxAmount}€` : 'Illimité'}</div>
        </div>
        <div>
          <span className="text-gray-500">Pourcentage:</span>
          <div className="font-semibold">{tier.percentage}%</div>
        </div>
        <div>
          <span className="text-gray-500">Montant fixe:</span>
          <div className="font-semibold">{tier.fixedAmount}€</div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-3 rounded text-sm">
        <div className="font-medium mb-2">Exemples de commissions :</div>
        <div className="grid grid-cols-3 gap-4">
          {[100, 500, 1000].map(amount => {
            if (amount >= tier.minAmount && (!tier.maxAmount || amount <= tier.maxAmount)) {
              const commission = calculateCommission(amount, tier);
              return (
                <div key={amount}>
                  <span className="text-gray-600">{amount}€ → </span>
                  <span className="font-semibold text-green-600">{commission.toFixed(2)}€</span>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
