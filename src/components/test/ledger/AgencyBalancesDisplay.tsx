
import { Card } from "@/components/ui/card";
import { AgencyLedger } from "@/types/ledger";

interface AgencyBalancesDisplayProps {
  agencyLedgers: AgencyLedger[];
}

export function AgencyBalancesDisplay({ agencyLedgers }: AgencyBalancesDisplayProps) {
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  if (agencyLedgers.length === 0) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Balances par agence ({agencyLedgers.length})</h3>
      
      <div className="space-y-4">
        {agencyLedgers.map((ledger, index) => (
          <div key={`${ledger.agencyId}-${index}`} className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">{ledger.agencyName}</h4>
            
            <div className="space-y-3">
              {Object.entries(ledger.balancesByCurrency).map(([currency, balance]) => (
                <div key={`${ledger.agencyId}-${currency}`} className="bg-gray-50 p-3 rounded">
                  <h5 className="font-medium mb-2">{currency}</h5>
                  <div className="grid grid-cols-5 gap-2 text-sm">
                    <div>
                      <strong>Actifs:</strong><br />
                      <span className="text-green-600">
                        {formatAmount(balance.totalAssets, currency)}
                      </span>
                    </div>
                    <div>
                      <strong>Passifs:</strong><br />
                      <span className="text-red-600">
                        {formatAmount(balance.totalLiabilities, currency)}
                      </span>
                    </div>
                    <div>
                      <strong>Revenus:</strong><br />
                      <span className="text-green-600">
                        {formatAmount(balance.totalRevenue, currency)}
                      </span>
                    </div>
                    <div>
                      <strong>Charges:</strong><br />
                      <span className="text-red-600">
                        {formatAmount(balance.totalExpenses, currency)}
                      </span>
                    </div>
                    <div>
                      <strong>Position nette:</strong><br />
                      <span className={balance.netPosition >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {formatAmount(balance.netPosition, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
