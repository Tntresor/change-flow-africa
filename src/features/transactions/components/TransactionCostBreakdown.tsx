
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TransactionCostBreakdown } from "@/types/transactionCost";
import { Calculator, DollarSign, Receipt, TrendingUp } from "lucide-react";

interface TransactionCostBreakdownProps {
  breakdown: TransactionCostBreakdown;
  currency: string;
}

export function TransactionCostBreakdownComponent({ breakdown, currency }: TransactionCostBreakdownProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Détail des Coûts de Transaction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Capital tiers */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Capital tiers utilisé</span>
          </div>
          <span className="font-semibold text-blue-800">
            {formatAmount(breakdown.thirdPartyCapital)} {currency}
          </span>
        </div>

        {/* Frais fixes */}
        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-orange-600" />
            <span className="font-medium">Frais fixes</span>
          </div>
          <span className="font-semibold text-orange-800">
            {formatAmount(breakdown.fixedFees)} {currency}
          </span>
        </div>

        {/* Frais variables */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="font-medium">Frais variables</span>
          </div>
          <span className="font-semibold text-green-800">
            {formatAmount(breakdown.variableFees)} {currency}
          </span>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border-2 border-gray-300">
          <span className="text-lg font-bold">Coût total tiers</span>
          <span className="text-lg font-bold text-gray-800">
            {formatAmount(breakdown.totalThirdPartyCost)} {currency}
          </span>
        </div>

        {/* Détail des frais */}
        {breakdown.feeDetails.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3 text-gray-700">Détail des frais appliqués</h4>
            <div className="space-y-2">
              {breakdown.feeDetails.map((fee, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {fee.type}
                    </Badge>
                    <span className="text-sm">{fee.feeName}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatAmount(fee.appliedAmount)} {currency}
                    </div>
                    {fee.calculationBase && (
                      <div className="text-xs text-gray-500">
                        Base: {formatAmount(fee.calculationBase)} {currency}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
