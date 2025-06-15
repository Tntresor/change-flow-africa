
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  File, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  RefreshCw, 
  FileText,
  Database,
  Clock,
  X
} from "lucide-react";

interface ImportFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "pending" | "processing" | "completed" | "error";
  progress: number;
  records: number;
  errors: string[];
  uploadedAt: Date;
}

interface PreviewData {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

const mockImportHistory: ImportFile[] = [
  {
    id: "1",
    name: "transactions_janvier_2024.csv",
    size: 2048576,
    type: "csv",
    status: "completed",
    progress: 100,
    records: 1250,
    errors: [],
    uploadedAt: new Date(2024, 0, 15)
  },
  {
    id: "2",
    name: "clients_export.xlsx",
    size: 1024000,
    type: "xlsx",
    status: "error",
    progress: 45,
    records: 0,
    errors: ["Format de date invalide ligne 23", "Devise non reconnue ligne 87"],
    uploadedAt: new Date(2024, 0, 10)
  }
];

const mockPreviewData: PreviewData = {
  headers: ["Date", "Montant", "Devise source", "Devise cible", "Taux", "Commission", "Client"],
  rows: [
    ["2024-01-15", "1000.00", "EUR", "USD", "1.0856", "2.5", "Jean Dupont"],
    ["2024-01-15", "500.00", "GBP", "EUR", "1.1547", "2.8", "Marie Martin"],
    ["2024-01-16", "2000.00", "USD", "EUR", "0.9211", "2.2", "Pierre Durand"],
  ],
  totalRows: 1250
};

export default function ImportPage() {
  const [files, setFiles] = useState<ImportFile[]>(mockImportHistory);
  const [dragActive, setDragActive] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [selectedMapping, setSelectedMapping] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const file = fileList[0];
    if (file) {
      const newFile: ImportFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.name.split('.').pop() || 'unknown',
        status: "pending",
        progress: 0,
        records: 0,
        errors: [],
        uploadedAt: new Date()
      };
      
      setFiles(prev => [newFile, ...prev]);
      setPreviewData(mockPreviewData);
      
      // Simuler le processing
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === newFile.id ? { ...f, status: "processing", progress: 30 } : f
        ));
      }, 1000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: ImportFile["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "processing":
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: ImportFile["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Erreur</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">En attente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import de données</h1>
          <p className="text-gray-600 mt-2">Importez vos données de transactions et clients</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Télécharger modèle
        </Button>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Nouvel import</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Upload Zone */}
          <Card>
            <CardHeader>
              <CardTitle>Télécharger un fichier</CardTitle>
              <CardDescription>
                Formats supportés: CSV, Excel (.xlsx, .xls). Taille maximale: 50MB
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Glissez-déposez votre fichier ici
                </p>
                <p className="text-gray-600 mb-4">ou</p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Parcourir les fichiers
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {previewData && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Prévisualisation des données</CardTitle>
                    <CardDescription>
                      {previewData.totalRows} lignes détectées • Configurez le mapping des colonnes
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Column Mapping */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Mappage des colonnes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {previewData.headers.map((header, index) => (
                      <div key={index} className="space-y-2">
                        <Label>Colonne: {header}</Label>
                        <Select 
                          value={selectedMapping[header] || ""} 
                          onValueChange={(value) => 
                            setSelectedMapping(prev => ({...prev, [header]: value}))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un champ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="amount">Montant</SelectItem>
                            <SelectItem value="source_currency">Devise source</SelectItem>
                            <SelectItem value="target_currency">Devise cible</SelectItem>
                            <SelectItem value="rate">Taux de change</SelectItem>
                            <SelectItem value="commission">Commission</SelectItem>
                            <SelectItem value="client">Client</SelectItem>
                            <SelectItem value="ignore">Ignorer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Aperçu des données</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {previewData.headers.map((header, index) => (
                            <TableHead key={index}>{header}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.rows.map((row, index) => (
                          <TableRow key={index}>
                            {row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <p className="text-sm text-gray-600">
                    Affichage des 3 premières lignes sur {previewData.totalRows} au total
                  </p>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline">
                    Annuler
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Database className="w-4 h-4 mr-2" />
                    Lancer l'import
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des imports</CardTitle>
              <CardDescription>Suivez le statut de vos imports de données</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {files.map((file) => (
                  <div key={file.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FileText className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{file.name}</h3>
                          <p className="text-sm text-gray-600">
                            {formatFileSize(file.size)} • {file.type.toUpperCase()} • 
                            {file.uploadedAt.toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(file.status)}
                        {getStatusBadge(file.status)}
                      </div>
                    </div>

                    {file.status === "processing" && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progression</span>
                          <span>{file.progress}%</span>
                        </div>
                        <Progress value={file.progress} className="h-2" />
                      </div>
                    )}

                    {file.status === "completed" && (
                      <div className="mb-4">
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            Import terminé avec succès. {file.records} enregistrements traités.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}

                    {file.status === "error" && file.errors.length > 0 && (
                      <div className="mb-4">
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Erreurs détectées:
                            <ul className="list-disc list-inside mt-2">
                              {file.errors.map((error, index) => (
                                <li key={index} className="text-sm">{error}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {file.records > 0 && `${file.records} enregistrements`}
                      </div>
                      <div className="flex gap-2">
                        {file.status === "error" && (
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Réessayer
                          </Button>
                        )}
                        {file.status === "completed" && (
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Rapport
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
