
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AgencyCashView } from "@/features/cash-management/components/AgencyCashView";
import { CashManagementService } from "@/features/cash-management/services/cashManagementService";
import { TransactionCostService } from "@/features/transactions/services/transactionCostService";
import { ReconciliationView } from "@/features/reconciliation/components/ReconciliationView";
import { mockAgencyCashSummaries } from "@/data/mockCashManagementData";
import { mockReconciliationReports } from "@/data/mockReconciliationData";
import { mockThirdPartyFees, mockTransactionCostBreakdowns } from "@/data/mockTransactionCostData";
import { CashTransferRequest } from "@/types/cashManagement";
import { Calculator, Vault, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TestFeaturesPage() {
  const [selectedAgency, setSelectedAgency] = useState(0);
  const [cashSummaries, setCashSummaries] = useState(mockAgencyCashSummaries);
  const { toast } = useToast();

  const handleCashTransfer = (request: CashTransferRequest) => {
    console.log("Processing cash transfer:", request);
    
    const currentSummary = cashSummaries[selectedAgency];
    const result = CashManagementService.processCashTransfer(
      request,
      currentSummary.tills,
      currentSummary.vault
    );

    if (result.success && result.updatedTills && result.updatedVault) {
      const updatedSummary = CashManagementService.consolidateAgencyCash(
        result.updatedTills,
        result.updatedVault
      );

      setCashSummaries(prev => prev.map((summary, index) => 
        index === selectedAgency ? updatedSummary : summary
      ));

      toast({
        title: "Transfert réussi",
        description: `${request.amount} ${request.currency} transféré avec succès`,
      });
    } else {
      toast({
        title: "Erreur de transfert",
        description: result.error || "Erreur inconnue",
        variant: "destructive"
      });
    }
  };

  const testTransactionCost = () => {
    const testResult = TransactionCostService.calculateTransactionCost(
      1000, // 1000 EUR
      "EUR",
      1.085, // Taux vers USD
      mockThirdPartyFees.filter(f => f.isActive),
      "international_transfer"
    );

    toast({
      title: "Test de calcul des coûts",
      description: `Coût total: ${testResult.totalThirdPartyCost} EUR`,
    });

    console.log("Transaction cost calculation result:", testResult);
  };

  const formatAmount = (amount: number, currency = "EUR") => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-orange-100 text-orange-800';
      case 'balanced': return 'bg-green-100 text-green-800';
      case 'variance_documented': return 'bg-blue-100 text-blue-800';
      case 'variance_unresolved': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Test des Nouvelles Fonctionnalités</h1>
        <Button onClick={testTransactionCost} variant="outline">
          <Calculator className="w-4 h-4 mr-2" />
          Test Calcul Coûts
        </Button>
      </div>

      <Tabs defaultValue="cash-management" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cash-management" className="flex items-center gap-2">
            <Vault className="w-4 h-4" />
            Gestion de Caisse
          </TabsTrigger>
          <TabsTrigger value="transaction-costs" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Coûts Transactions
          </TabsTrigger>
          <TabsTrigger value="reconciliation" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Réconciliation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cash-management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sélection d'Agence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cashSummaries.map((summary, index) => (
                  <Button
                    key={summary.agencyId}
                    variant={selectedAgency === index ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-start"
                    onClick={() => setSelectedAgency(index)}
                  >
                    <div className="font-semibold">{summary.agencyName}</div>
                    <div className="text-sm text-left">
                      {Object.entries(summary.totalsByCurrency).map(([currency, total]) => (
                        <div key={currency}>
                          {currency}: {formatAmount(total as number, currency)}
                        </div>
                      ))}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <AgencyCashView
            cashSummary={cashSummaries[selectedAgency]}
            onCashTransfer={handleCashTransfer}
          />
        </TabsContent>

        <TabsContent value="transaction-costs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Configuration des frais */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration des Frais Tiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockThirdPartyFees.map((fee) => (
                  <div key={fee.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{fee.name}</div>
                      <div className="text-sm text-gray-600">{fee.description}</div>
                      <div className="text-xs text-gray-500">
                        Type: {fee.type} | Transaction: {fee.transactionType}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={fee.isActive ? "default" : "secondary"}>
                        {fee.isActive ? "Actif" : "Inactif"}
                      </Badge>
                      <div className="text-sm mt-1">
                        {fee.type === 'fixed' && formatAmount(fee.fixedAmount || 0)}
                        {fee.type === 'percentage' && `${fee.percentage}%`}
                        {fee.type === 'mixed' && `${formatAmount(fee.fixedAmount || 0)} + ${fee.percentage}%`}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Exemple de calcul */}
            <Card>
              <CardHeader>
                <CardTitle>Exemple de Calcul de Coût</CardTitle>
              </CardHeader>
              <CardContent>
                {mockTransactionCostBreakdowns.map((breakdown, index) => (
                  <div key={index} className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Capital tiers:</div>
                      <div className="font-medium">{formatAmount(breakdown.thirdPartyCapital)}</div>
                      
                      <div>Frais fixes:</div>
                      <div className="font-medium">{formatAmount(breakdown.fixedFees)}</div>
                      
                      <div>Frais variables:</div>
                      <div className="font-medium">{formatAmount(breakdown.variableFees)}</div>
                      
                      <div className="font-semibold border-t pt-2">Total:</div>
                      <div className="font-semibold border-t pt-2">
                        {formatAmount(breakdown.totalThirdPartyCost)}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Détail des frais:</h4>
                      {breakdown.feeDetails.map((detail) => (
                        <div key={detail.feeId} className="text-sm flex justify-between py-1">
                          <span>{detail.feeName}</span>
                          <span>{formatAmount(detail.appliedAmount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockReconciliationReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{report.agencyName}</span>
                    <Badge className={getStatusColor(report.status)} variant="outline">
                      {report.status === 'completed' ? 'Terminé' : 
                       report.status === 'pending_review' ? 'En attente' : report.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Résumé des écarts */}
                  <div>
                    <h4 className="font-medium mb-2">Écarts totaux:</h4>
                    {Object.entries(report.totalVariance).map(([currency, variance]) => (
                      <div key={currency} className="flex justify-between text-sm">
                        <span>{currency}:</span>
                        <span className={variance === 0 ? "text-green-600" : variance > 0 ? "text-blue-600" : "text-red-600"}>
                          {variance > 0 ? '+' : ''}{formatAmount(variance as number, currency)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Entrées de réconciliation */}
                  <div>
                    <h4 className="font-medium mb-2">Entrées ({report.entries.length}):</h4>
                    {report.entries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                        <div>
                          <div className="font-medium">{entry.agentName}</div>
                          <div className="text-gray-600">{entry.currency}</div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            {entry.status === 'balanced' ? (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-orange-600" />
                            )}
                            <Badge className={getStatusColor(entry.status)} variant="outline">
                              {entry.status === 'balanced' ? 'OK' : 
                               entry.status === 'variance_documented' ? 'Documenté' : 'Non résolu'}
                            </Badge>
                          </div>
                          {entry.variance !== 0 && (
                            <div className={entry.variance > 0 ? "text-blue-600" : "text-red-600"}>
                              {entry.variance > 0 ? '+' : ''}{formatAmount(entry.variance, entry.currency)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Piste d'audit */}
                  <div>
                    <h4 className="font-medium mb-2">Dernières actions:</h4>
                    {report.auditTrail.slice(-3).map((audit) => (
                      <div key={audit.id} className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                        <div className="font-medium">{audit.action}</div>
                        <div>Par: {audit.performedBy}</div>
                        <div>{audit.timestamp.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
