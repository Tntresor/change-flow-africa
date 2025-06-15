
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLiquidityManager } from "@/hooks/useLiquidityManager";
import { AgencyLiquidityView } from "./AgencyLiquidityView";
import { PoolLiquidityView } from "./PoolLiquidityView";
import { LiquidityTransfers } from "./LiquidityTransfers";
import { LiquidityAlerts } from "./LiquidityAlerts";
import { CashOperationsList } from "./CashOperationsList";
import { Droplets, Building, Shuffle, AlertTriangle, CreditCard } from "lucide-react";

export function LiquidityDashboard() {
  const { agencyLiquidity, poolLiquidity, transfers, cashOperations } = useLiquidityManager();

  const totalAlerts = agencyLiquidity.reduce((sum, agency) => sum + agency.alerts.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion de Liquidité</h1>
          <p className="text-gray-600 mt-2">Surveillez et gérez la liquidité de vos agences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agences actives</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agencyLiquidity.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devises gérées</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{poolLiquidity.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transferts en cours</CardTitle>
            <Shuffle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transfers.filter(t => t.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opérations Cash</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cashOperations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes actives</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalAlerts}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agencies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="agencies">Par Agence</TabsTrigger>
          <TabsTrigger value="pool">Liquidité Poolée</TabsTrigger>
          <TabsTrigger value="operations">Opérations Cash</TabsTrigger>
          <TabsTrigger value="transfers">Transferts</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
        </TabsList>

        <TabsContent value="agencies">
          <AgencyLiquidityView agencies={agencyLiquidity} />
        </TabsContent>

        <TabsContent value="pool">
          <PoolLiquidityView pools={poolLiquidity} />
        </TabsContent>

        <TabsContent value="operations">
          <CashOperationsList operations={cashOperations} />
        </TabsContent>

        <TabsContent value="transfers">
          <LiquidityTransfers transfers={transfers} />
        </TabsContent>

        <TabsContent value="alerts">
          <LiquidityAlerts agencies={agencyLiquidity} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
