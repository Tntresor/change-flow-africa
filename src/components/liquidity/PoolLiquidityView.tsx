
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PoolLiquidity } from "@/types/liquidity";

interface PoolLiquidityViewProps {
  pools: PoolLiquidity[];
}

export function PoolLiquidityView({ pools }: PoolLiquidityViewProps) {
  return (
    <div className="space-y-6">
      {pools.map((pool) => (
        <Card key={pool.currency}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Pool {pool.currency}
              <div className="text-sm font-normal text-gray-600">
                Total: {pool.totalBalance.toLocaleString()} {pool.currency}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {pool.totalAvailable.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Disponible</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {pool.totalReserved.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Réservé</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {pool.totalBalance.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Répartition par agence</h4>
              {pool.agencies.map((agency) => (
                <div key={agency.agencyId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{agency.agencyName}</span>
                    <div className="text-sm">
                      {agency.balance.toLocaleString()} ({agency.percentage.toFixed(1)}%)
                    </div>
                  </div>
                  <Progress value={agency.percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Disponible: {agency.available.toLocaleString()}</span>
                    <span>Réservé: {(agency.balance - agency.available).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
