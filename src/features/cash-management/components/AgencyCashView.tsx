
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AgencyCashSummary, CashierTill, SafeVault, CashTransferRequest } from "@/types/cashManagement";
import { Vault, Users, ArrowRightLeft, Eye } from "lucide-react";
import { CashTransferForm } from "./CashTransferForm";
import { formatAmount } from "@/data/mockData";

interface AgencyCashViewProps {
  cashSummary: AgencyCashSummary;
  onCashTransfer: (request: CashTransferRequest) => void;
}

export function AgencyCashView({ cashSummary, onCashTransfer }: AgencyCashViewProps) {
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [selectedTill, setSelectedTill] = useState<CashierTill | null>(null);

  const getTotalForCurrency = (currency: string) => {
    return cashSummary.totalsByCurrency[currency] || 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-green-100 text-green-800';
      case 'high': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Vue consolidée */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Vault className="w-5 h-5 text-blue-600" />
              {cashSummary.agencyName} - Liquidités Totales
            </div>
            <Dialog open={showTransferForm} onOpenChange={setShowTransferForm}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowRightLeft className="w-4 h-4 mr-1" />
                  Transfert
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <CashTransferForm
                  tills={cashSummary.tills}
                  vault={cashSummary.vault}
                  onSubmit={(request) => {
                    onCashTransfer(request);
                    setShowTransferForm(false);
                  }}
                  onCancel={() => setShowTransferForm(false)}
                />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(cashSummary.totalsByCurrency).map(([currency, total]) => (
              <div key={currency} className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-800">
                  {formatAmount(total as number, currency)}
                </div>
                <div className="text-sm text-blue-600 font-medium">{currency}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Détail par caisse et coffre */}
      <Tabs defaultValue="tills" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tills" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Caisses ({cashSummary.tills.length})
          </TabsTrigger>
          <TabsTrigger value="vault" className="flex items-center gap-2">
            <Vault className="w-4 h-4" />
            Coffre-Fort
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tills" className="space-y-4">
          {cashSummary.tills.map((till, index) => (
            <Card key={till.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Caisse #{index + 1}
                    </Badge>
                    <span>{till.cashierName}</span>
                    <Badge variant={till.isActive ? "default" : "secondary"}>
                      {till.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTill(till)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Détail
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {till.balances.map((balance) => (
                    <div key={balance.currency} className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-semibold">{formatAmount(balance.balance, balance.currency)}</div>
                      <div className="text-sm text-gray-600">{balance.currency}</div>
                      <Badge 
                        className={`text-xs mt-1 ${getStatusColor(balance.status)}`}
                        variant="outline"
                      >
                        {balance.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Dernière activité: {till.lastActivity.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="vault">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vault className="w-5 h-5 text-purple-600" />
                Coffre-Fort Principal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cashSummary.vault.balances.map((balance) => (
                  <div key={balance.currency} className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-800">
                      {formatAmount(balance.balance, balance.currency)}
                    </div>
                    <div className="text-sm text-purple-600 font-medium">{balance.currency}</div>
                    <Badge 
                      className={`text-xs mt-2 ${getStatusColor(balance.status)}`}
                      variant="outline"
                    >
                      {balance.status}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      Disponible: {formatAmount(balance.availableAmount, balance.currency)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Dernière mise à jour: {cashSummary.vault.lastUpdated.toLocaleString()}
              </div>
              <div className="mt-2 text-sm text-purple-600">
                Niveau d'accès: {cashSummary.vault.accessLevel}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog pour le détail d'une caisse */}
      {selectedTill && (
        <Dialog open={!!selectedTill} onOpenChange={() => setSelectedTill(null)}>
          <DialogContent>
            <Card>
              <CardHeader>
                <CardTitle>
                  Caisse #{cashSummary.tills.findIndex(t => t.id === selectedTill.id) + 1} - {selectedTill.cashierName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTill.balances.map((balance) => (
                  <div key={balance.currency} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{balance.currency}</div>
                      <div className="text-sm text-gray-500">
                        Seuils: {formatAmount(balance.minThreshold, balance.currency)} - {formatAmount(balance.maxThreshold, balance.currency)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatAmount(balance.balance, balance.currency)}</div>
                      <div className="text-sm text-gray-500">
                        Disponible: {formatAmount(balance.availableAmount, balance.currency)}
                      </div>
                      {balance.reservedAmount > 0 && (
                        <div className="text-xs text-orange-600">
                          Réservé: {formatAmount(balance.reservedAmount, balance.currency)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
