
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiquidityDashboard } from "@/components/liquidity/LiquidityDashboard";
import { LiquidityTransferManager } from "@/components/liquidity/LiquidityTransferManager";
import { CashAllocationManager } from "@/components/liquidity/CashAllocationManager";
import { Badge } from "@/components/ui/badge";
import { Banknote, ArrowRightLeft, Vault, TrendingUp } from "lucide-react";

export default function LiquidityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion de la Liquidité</h1>
        <p className="text-gray-600 mt-2">
          Surveillance, allocation et transferts de liquidité entre agences
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Tableau de bord
          </TabsTrigger>
          <TabsTrigger value="transfers" className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            Transferts
          </TabsTrigger>
          <TabsTrigger value="allocation" className="flex items-center gap-2">
            <Vault className="w-4 h-4" />
            Allocation Caisses
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center gap-2">
            <Banknote className="w-4 h-4" />
            Opérations
            <Badge variant="secondary" className="text-xs">Beta</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <LiquidityDashboard />
        </TabsContent>

        <TabsContent value="transfers">
          <LiquidityTransferManager />
        </TabsContent>

        <TabsContent value="allocation">
          <CashAllocationManager />
        </TabsContent>

        <TabsContent value="operations">
          <div className="text-center py-8 text-gray-500">
            Opérations avancées de liquidité - Fonctionnalité en développement
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
