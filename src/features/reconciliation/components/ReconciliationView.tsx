
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ReconciliationEntry, ReconciliationReport } from "@/types/reconciliation";
import { AlertCircle, CheckCircle, FileText, Eye, AlertTriangle } from "lucide-react";
import { ReconciliationEntryForm } from "./ReconciliationEntryForm";

interface ReconciliationViewProps {
  report: ReconciliationReport;
  onUpdateEntry: (entryId: string, status: ReconciliationEntry['status'], notes?: string) => void;
  onGenerateReport: () => void;
}

export function ReconciliationView({ report, onUpdateEntry, onGenerateReport }: ReconciliationViewProps) {
  const [selectedEntry, setSelectedEntry] = useState<ReconciliationEntry | null>(null);
  const [showEntryForm, setShowEntryForm] = useState(false);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusIcon = (status: ReconciliationEntry['status']) => {
    switch (status) {
      case 'balanced':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'variance_documented':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'variance_unresolved':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: ReconciliationEntry['status']) => {
    switch (status) {
      case 'balanced':
        return 'bg-green-100 text-green-800';
      case 'variance_documented':
        return 'bg-orange-100 text-orange-800';
      case 'variance_unresolved':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVarianceColor = (variance: number) => {
    if (Math.abs(variance) < 0.01) return 'text-green-600';
    if (Math.abs(variance) < 10) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* En-tête du rapport */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Réconciliation {report.agencyName}
            </div>
            <div className="flex items-center gap-2">
              <Badge className={report.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                {report.status === 'completed' ? 'Terminé' : 'En cours'}
              </Badge>
              <Button onClick={onGenerateReport} variant="outline" size="sm">
                Régénérer
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(report.totalVariance).map(([currency, variance]) => (
              <div key={currency} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className={`text-lg font-bold ${getVarianceColor(variance)}`}>
                  {variance >= 0 ? '+' : ''}{formatAmount(variance)}
                </div>
                <div className="text-sm text-gray-600">{currency}</div>
                <div className="text-xs text-gray-500">Variance totale</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Rapport généré le: {report.date.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Liste des entrées de réconciliation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Entrées de réconciliation ({report.entries.length})</h3>
          <Dialog open={showEntryForm} onOpenChange={setShowEntryForm}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Nouvelle entrée
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <ReconciliationEntryForm
                agencyId={report.agencyId}
                onSubmit={() => setShowEntryForm(false)}
                onCancel={() => setShowEntryForm(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {report.entries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  {getStatusIcon(entry.status)}
                  <span>{entry.agentName}</span>
                  <Badge variant="outline">{entry.currency}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(entry.status)}>
                    {entry.status === 'balanced' ? 'Équilibré' :
                     entry.status === 'variance_documented' ? 'Écart documenté' : 'Écart non résolu'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Détail
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-800">
                    {formatAmount(entry.theoreticalBalance)}
                  </div>
                  <div className="text-sm text-blue-600">Théorique</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="font-semibold text-green-800">
                    {formatAmount(entry.actualCash)}
                  </div>
                  <div className="text-sm text-green-600">Réel</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className={`font-semibold ${getVarianceColor(entry.variance)}`}>
                    {entry.variance >= 0 ? '+' : ''}{formatAmount(entry.variance)}
                  </div>
                  <div className="text-sm text-gray-600">Écart</div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded">
                  <div className="font-semibold text-purple-800">
                    {entry.transactions.length}
                  </div>
                  <div className="text-sm text-purple-600">Transactions</div>
                </div>
              </div>
              
              {entry.notes && (
                <div className="mt-4 p-3 bg-yellow-50 rounded border-l-4 border-yellow-300">
                  <div className="text-sm font-medium text-yellow-800">Notes:</div>
                  <div className="text-sm text-yellow-700">{entry.notes}</div>
                </div>
              )}
              
              <div className="mt-4 text-xs text-gray-500">
                Caisse: {entry.tillId} • {entry.date.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog pour le détail d'une entrée */}
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(selectedEntry.status)}
                  Détail de réconciliation - {selectedEntry.agentName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Résumé */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-800">
                      {formatAmount(selectedEntry.theoreticalBalance)}
                    </div>
                    <div className="text-sm text-blue-600">Solde théorique</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-800">
                      {formatAmount(selectedEntry.actualCash)}
                    </div>
                    <div className="text-sm text-green-600">Cash réel</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className={`text-xl font-bold ${getVarianceColor(selectedEntry.variance)}`}>
                      {selectedEntry.variance >= 0 ? '+' : ''}{formatAmount(selectedEntry.variance)}
                    </div>
                    <div className="text-sm text-gray-600">Écart</div>
                  </div>
                </div>

                {/* Liste des transactions */}
                <div>
                  <h4 className="font-medium mb-3">Transactions de la journée ({selectedEntry.transactions.length})</h4>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {selectedEntry.transactions.map((tx, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {tx.type}
                          </Badge>
                          <span className="text-sm">{tx.transactionId}</span>
                          <span className="text-xs text-gray-500">
                            {tx.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className={`font-medium ${tx.impact === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.impact === 'credit' ? '+' : '-'}{formatAmount(tx.amount)} {tx.currency}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  {selectedEntry.status === 'variance_unresolved' && (
                    <>
                      <Button
                        onClick={() => {
                          onUpdateEntry(selectedEntry.id, 'variance_documented', 'Écart documenté par l\'utilisateur');
                          setSelectedEntry(null);
                        }}
                        variant="outline"
                      >
                        Documenter l'écart
                      </Button>
                      <Button
                        onClick={() => {
                          onUpdateEntry(selectedEntry.id, 'balanced', 'Corrigé manuellement');
                          setSelectedEntry(null);
                        }}
                      >
                        Marquer comme équilibré
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
