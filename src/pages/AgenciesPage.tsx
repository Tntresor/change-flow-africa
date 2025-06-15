
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgencyVolumeDisplay } from "@/components/agencies/AgencyVolumeDisplay";
import { EmployeeManager } from "@/components/employees/EmployeeManager";
import { mockAgencies, mockTransactions, mockLiquidityOperations, formatAmount } from "@/data/mockData";
import { useEmployeeManager } from "@/hooks/useEmployeeManager";
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  Eye
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AgenciesPage() {
  const [agencies] = useState(mockAgencies);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const { getEmployeesByAgency } = useEmployeeManager();
  const [primaryCurrency] = useState("XOF");
  const [secondaryCurrency] = useState("MAD");

  // Calculer les statistiques par agence
  const getAgencyStats = (agencyId: string) => {
    const agencyTransactions = mockTransactions.filter(t => t.agencyId === agencyId);
    const agencyEmployees = getEmployeesByAgency(agencyId);
    const agencyLiquidityOps = mockLiquidityOperations.filter(op => op.agencyId === agencyId);

    const totalVolume = agencyTransactions.reduce((sum, t) => sum + t.amount, 0);
    const completedTransactions = agencyTransactions.filter(t => t.status === 'completed').length;
    
    // Calculer les cash in/out par devise
    const cashOperations = agencyLiquidityOps.reduce((acc, op) => {
      if (!acc[op.currency]) {
        acc[op.currency] = { cashIn: 0, cashOut: 0 };
      }
      if (op.type === 'cash_in') {
        acc[op.currency].cashIn += op.amount;
      } else {
        acc[op.currency].cashOut += op.amount;
      }
      return acc;
    }, {} as Record<string, { cashIn: number; cashOut: number }>);

    return {
      totalTransactions: agencyTransactions.length,
      completedTransactions,
      totalVolume,
      employeeCount: agencyEmployees.length,
      cashOperations
    };
  };

  const getAgencyTransactions = (agencyId: string) => {
    return mockTransactions.filter(t => t.agencyId === agencyId);
  };

  const mockAgencyVolumes = agencies.map(agency => {
    const stats = getAgencyStats(agency.id);
    return {
      agencyName: agency.name,
      location: `${agency.country}`,
      monthlyVolume: stats.totalVolume,
      previousMonthVolume: stats.totalVolume * 0.85,
      transactionCount: stats.totalTransactions
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Agences</h1>
          <p className="text-gray-600 mt-2">Gérez votre réseau d'agences et surveillez leurs performances</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Agence
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="volumes">Volumes</TabsTrigger>
          <TabsTrigger value="employees">Employés</TabsTrigger>
          <TabsTrigger value="management">Gestion</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencies.map((agency) => {
              const stats = getAgencyStats(agency.id);
              return (
                <Card key={agency.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      {agency.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={agency.isActive ? "default" : "secondary"}>
                        {agency.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{agency.code}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{agency.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{stats.employeeCount} employés</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{stats.totalTransactions} transactions</span>
                    </div>
                    
                    {/* Opérations de liquidité par devise */}
                    <div className="pt-3 border-t space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Liquidité</h4>
                      {Object.entries(stats.cashOperations).map(([currency, ops]) => (
                        <div key={currency} className="text-xs space-y-1">
                          <div className="font-medium">{currency}</div>
                          <div className="flex items-center gap-2 text-green-600">
                            <ArrowDownCircle className="w-3 h-3" />
                            <span>In: {formatAmount(ops.cashIn, currency)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-red-600">
                            <ArrowUpCircle className="w-3 h-3" />
                            <span>Out: {formatAmount(ops.cashOut, currency)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir les transactions
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Transactions - {agency.name}</DialogTitle>
                            <DialogDescription>
                              Liste des transactions effectuées par cette agence
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                              <Card>
                                <CardContent className="p-4">
                                  <div className="text-2xl font-bold">{stats.totalTransactions}</div>
                                  <div className="text-sm text-gray-600">Total transactions</div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-4">
                                  <div className="text-2xl font-bold">{stats.completedTransactions}</div>
                                  <div className="text-sm text-gray-600">Complétées</div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-4">
                                  <div className="text-2xl font-bold">{formatAmount(stats.totalVolume, 'EUR')}</div>
                                  <div className="text-sm text-gray-600">Volume total</div>
                                </CardContent>
                              </Card>
                            </div>
                            
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>ID</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Montant</TableHead>
                                  <TableHead>Devise</TableHead>
                                  <TableHead>Statut</TableHead>
                                  <TableHead>Date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {getAgencyTransactions(agency.id).slice(0, 10).map((transaction) => (
                                  <TableRow key={transaction.id}>
                                    <TableCell className="font-mono text-xs">{transaction.prefixId}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline">
                                        {transaction.type.replace('_', ' ')}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                      {formatAmount(transaction.amount, transaction.fromCurrency)}
                                    </TableCell>
                                    <TableCell>
                                      {transaction.fromCurrency} → {transaction.toCurrency}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={
                                        transaction.status === 'completed' ? 'default' :
                                        transaction.status === 'pending' ? 'secondary' :
                                        'destructive'
                                      }>
                                        {transaction.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      {transaction.timestamp.toLocaleDateString('fr-FR')}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="volumes" className="space-y-6">
          <AgencyVolumeDisplay
            primaryCurrency={primaryCurrency}
            secondaryCurrency={secondaryCurrency}
            agencies={mockAgencyVolumes}
          />
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          <EmployeeManager />
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Agences</CardTitle>
              <CardDescription>Gérez les informations de vos agences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agencies.map((agency) => {
                  const stats = getAgencyStats(agency.id);
                  return (
                    <div key={agency.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{agency.name}</h4>
                          <Badge variant="outline">{agency.code}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{agency.country}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{stats.employeeCount} employés</span>
                          <span>{stats.totalTransactions} transactions</span>
                          <span>{formatAmount(stats.totalVolume, 'EUR')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
