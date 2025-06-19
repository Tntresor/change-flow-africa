
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LedgerTest } from "@/components/test/LedgerTest";
import { TransactionTypeStats } from "@/components/stats/TransactionTypeStats";
import { Badge } from "@/components/ui/badge";
import { BarChart3, BookOpen } from "lucide-react";
import { useTransactionState } from "@/hooks/useTransactionState";

export default function StatsPage() {
  const { transactions } = useTransactionState();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Statistiques et Comptabilité</h1>
        <p className="text-gray-600 mt-2">
          Analyses des transactions et micro-ledger comptable
        </p>
      </div>

      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="ledger" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Micro-Ledger
            <Badge variant="secondary" className="text-xs">Beta</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques des transactions</CardTitle>
                <CardDescription>
                  Analyse des volumes et performances par type de transaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionTypeStats transactions={transactions} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ledger">
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Micro-Ledger Comptable</h2>
              <p className="text-gray-600">
                Génération automatique des écritures comptables et consolidation des balances
              </p>
            </div>
            <LedgerTest />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
