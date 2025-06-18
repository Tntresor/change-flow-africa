
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionCostEditor } from "@/components/features/TransactionCostEditor";
import { ReconciliationManager } from "@/components/features/ReconciliationManager";
import { CashManagementTest } from "@/components/features/CashManagementTest";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  FileCheck, 
  Banknote, 
  TrendingUp, 
  Users,
  Building,
  BarChart3,
  Shield
} from "lucide-react";

export default function TestFeaturesPage() {
  const [activeFeatures] = useState([
    { id: 'costs', name: 'Coûts de transaction', status: 'active' },
    { id: 'reconciliation', name: 'Réconciliation', status: 'active' },
    { id: 'cash', name: 'Gestion de caisse', status: 'beta' },
    { id: 'analytics', name: 'Analytics avancées', status: 'development' },
    { id: 'compliance', name: 'Compliance automatisée', status: 'development' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-orange-100 text-orange-800';
      case 'development': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'beta': return 'Bêta';
      case 'development': return 'En développement';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Fonctionnalités avancées</h1>
        <p className="text-gray-600 mt-2">
          Accédez aux fonctionnalités avancées et expérimentales de la plateforme
        </p>
      </div>

      {/* Vue d'ensemble des fonctionnalités */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            État des fonctionnalités
          </CardTitle>
          <CardDescription>
            Suivi de l'état de développement des fonctionnalités avancées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeFeatures.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{feature.name}</span>
                <Badge className={getStatusColor(feature.status)}>
                  {getStatusLabel(feature.status)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transaction-costs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transaction-costs" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Coûts de transaction
          </TabsTrigger>
          <TabsTrigger value="reconciliation" className="flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            Réconciliation
          </TabsTrigger>
          <TabsTrigger value="cash-management" className="flex items-center gap-2">
            <Banknote className="w-4 h-4" />
            Gestion de caisse
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transaction-costs">
          <TransactionCostEditor />
        </TabsContent>

        <TabsContent value="reconciliation">
          <ReconciliationManager />
        </TabsContent>

        <TabsContent value="cash-management">
          <CashManagementTest />
        </TabsContent>
      </Tabs>
    </div>
  );
}
