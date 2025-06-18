import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Play, Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReconciliationView } from "@/features/reconciliation/components/ReconciliationView";
import { ReconciliationReport, ReconciliationEntry } from "@/types/reconciliation";

interface ReportFile {
  id: string;
  name: string;
  type: 'bank_statement' | 'transaction_log' | 'cash_report';
  size: string;
  uploadDate: Date;
  agencyId: string;
  agencyName: string;
}

const mockReportFiles: ReportFile[] = [
  {
    id: '1',
    name: 'releve_bancaire_janvier_2024.pdf',
    type: 'bank_statement',
    size: '2.3 MB',
    uploadDate: new Date('2024-01-31'),
    agencyId: '1',
    agencyName: 'Agence Paris Centre'
  },
  {
    id: '2',
    name: 'transactions_log_janvier_2024.csv',
    type: 'transaction_log',
    size: '1.8 MB',
    uploadDate: new Date('2024-01-31'),
    agencyId: '1',
    agencyName: 'Agence Paris Centre'
  },
  {
    id: '3',
    name: 'rapport_caisse_janvier_2024.xlsx',
    type: 'cash_report',
    size: '456 KB',
    uploadDate: new Date('2024-01-31'),
    agencyId: '1',
    agencyName: 'Agence Paris Centre'
  },
  {
    id: '4',
    name: 'releve_bancaire_janvier_2024.pdf',
    type: 'bank_statement',
    size: '1.9 MB',
    uploadDate: new Date('2024-01-31'),
    agencyId: '2',
    agencyName: 'Agence Lyon Part-Dieu'
  }
];

const fileTypeLabels = {
  bank_statement: 'Relevé bancaire',
  transaction_log: 'Journal des transactions',
  cash_report: 'Rapport de caisse'
};

const fileTypeColors = {
  bank_statement: 'bg-blue-100 text-blue-800',
  transaction_log: 'bg-green-100 text-green-800',
  cash_report: 'bg-orange-100 text-orange-800'
};

// Mock reconciliation report
const mockReconciliationReport: ReconciliationReport = {
  id: 'report-1',
  agencyId: '1',
  agencyName: 'Agence Paris Centre',
  date: new Date(),
  entries: [],
  totalVariance: { EUR: 0, XOF: 0 },
  status: 'pending_review',
  auditTrail: []
};

export function ReconciliationManager() {
  const [reportFiles] = useState<ReportFile[]>(mockReportFiles);
  const [isRunningReconciliation, setIsRunningReconciliation] = useState(false);
  const [reconciliationReport, setReconciliationReport] = useState<ReconciliationReport>(mockReconciliationReport);
  const { toast } = useToast();

  const handleDownloadFile = (file: ReportFile) => {
    // Simulation du téléchargement
    toast({
      title: "Téléchargement démarré",
      description: `Téléchargement de ${file.name}`,
    });
  };

  const handleRunReconciliation = async () => {
    setIsRunningReconciliation(true);
    
    toast({
      title: "Réconciliation en cours",
      description: "Le processus de réconciliation a été démarré",
    });

    // Simulation du processus de réconciliation
    setTimeout(() => {
      setIsRunningReconciliation(false);
      toast({
        title: "Réconciliation terminée",
        description: "Le processus de réconciliation s'est terminé avec succès",
      });
    }, 5000);
  };

  const handleUpdateEntry = (entryId: string, updates: Partial<ReconciliationEntry>) => {
    setReconciliationReport(prev => ({
      ...prev,
      entries: prev.entries.map(entry => 
        entry.id === entryId ? { ...entry, ...updates } : entry
      )
    }));
    
    toast({
      title: "Entrée mise à jour",
      description: "L'entrée de réconciliation a été modifiée",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Rapport généré",
      description: "Le rapport de réconciliation a été généré avec succès",
    });
  };

  const getFilesByAgency = () => {
    const agencies = [...new Set(reportFiles.map(f => f.agencyId))];
    return agencies.map(agencyId => {
      const agencyFiles = reportFiles.filter(f => f.agencyId === agencyId);
      const agencyName = agencyFiles[0]?.agencyName || `Agence ${agencyId}`;
      return { agencyId, agencyName, files: agencyFiles };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Réconciliation</h2>
          <p className="text-gray-600">Gérez le processus de réconciliation et téléchargez les rapports</p>
        </div>
        <Button 
          onClick={handleRunReconciliation}
          disabled={isRunningReconciliation}
          className="bg-green-600 hover:bg-green-700"
        >
          <Play className="w-4 h-4 mr-2" />
          {isRunningReconciliation ? "Réconciliation en cours..." : "Lancer la réconciliation"}
        </Button>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reports">Fichiers de reporting</TabsTrigger>
          <TabsTrigger value="reconciliation">Réconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{reportFiles.length}</div>
                    <div className="text-sm text-gray-600">Fichiers total</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">Jan 2024</div>
                    <div className="text-sm text-gray-600">Dernière période</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm text-gray-600">Taux de réussite</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                  <div>
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-sm text-gray-600">Écarts détectés</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {getFilesByAgency().map(({ agencyId, agencyName, files }) => (
            <Card key={agencyId}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {agencyName}
                  <Badge variant="outline">{files.length} fichier{files.length > 1 ? 's' : ''}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-sm text-gray-500">
                            {file.size} • {file.uploadDate.toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <Badge className={fileTypeColors[file.type]}>
                          {fileTypeLabels[file.type]}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadFile(file)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-6">
          <ReconciliationView 
            report={reconciliationReport}
            onUpdateEntry={handleUpdateEntry}
            onGenerateReport={handleGenerateReport}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
