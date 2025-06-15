
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockTransactions, mockLiquidityOperations, formatAmount } from "@/data/mockData";
import { useEmployeeManager } from "@/hooks/useEmployeeManager";
import { 
  Building, 
  Users, 
  TrendingUp, 
  ArrowDownCircle, 
  ArrowUpCircle,
  ArrowLeftRight,
  DollarSign
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgencyDetailViewProps {
  agency: {
    id: string;
    name: string;
    code: string;
    country: string;
    isActive: boolean;
  };
}

export function AgencyDetailView({ agency }: AgencyDetailViewProps) {
  const { getEmployeesByAgency } = useEmployeeManager();
  
  // Filtrer les transactions de cette agence
  const agencyTransactions = mockTransactions.filter(t => t.agencyId === agency.id);
  const agencyEmployees = getEmployeesByAgency(agency.id);
  const agencyLiquidityOps = mockLiquidityOperations.filter(op => op.agencyId === agency.id);

  // Calculer les statistiques
  const totalVolume = agencyTransactions.reduce((sum, t) => sum + t.amount, 0);
  const completedTransactions = agencyTransactions.filter(t => t.status === 'completed');
  const pendingTransactions = agencyTransactions.filter(t => t.status === 'pending');

  // Calculs de liquidité par devise
  const liquidityByCurrency = agencyLiquidityOps.reduce((acc, op) => {
    if (!acc[op.currency]) {
      acc[op.currency] = { cashIn: 0, cashOut: 0, net: 0 };
    }
    if (op.type === 'cash_in') {
      acc[op.currency].cashIn += op.amount;
    } else {
      acc[op.currency].cashOut += op.amount;
    }
    acc[op.currency].net = acc[op.currency].cashIn - acc[op.currency].cashOut;
    return acc;
  }, {} as Record<string, { cashIn: number; cashOut: number; net: number }>);

  // Calculs des transferts internes (débit/crédit)
  const internalTransfers = agencyTransactions.filter(t => t.type === 'internal_transfer');
  const outgoingTransfers = internalTransfers.filter(t => t.origin.id === agency.id);
  const incomingTransfers = agencyTransactions.filter(t => 
    t.type === 'internal_transfer' && t.destination.id === agency.id
  );

  const transferBalance = incomingTransfers.reduce((sum, t) => sum + t.convertedAmount, 0) - 
                         outgoingTransfers.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* En-tête de l'agence */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Building className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{agency.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{agency.code}</Badge>
                <Badge variant={agency.isActive ? "default" : "secondary"}>
                  {agency.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-2">{agency.country}</p>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agencyTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedTransactions.length} complétées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(totalVolume, 'EUR')}</div>
            <p className="text-xs text-muted-foreground">
              Toutes devises confondues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agencyEmployees.length}</div>
            <p className="text-xs text-muted-foreground">
              Actifs dans l'agence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Transferts</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${transferBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatAmount(Math.abs(transferBalance), 'EUR')}
            </div>
            <p className="text-xs text-muted-foreground">
              {transferBalance >= 0 ? 'Créditeur' : 'Débiteur'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidité</TabsTrigger>
          <TabsTrigger value="transfers">Transferts Internes</TabsTrigger>
          <TabsTrigger value="employees">Employés</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactions de l'agence</CardTitle>
              <CardDescription>
                Liste complète des transactions effectuées par cette agence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Devise</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agencyTransactions.slice(0, 20).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">
                        {transaction.prefixId}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transaction.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.sender.name}</TableCell>
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
                      <TableCell>
                        {transaction.timestamp.toLocaleDateString('fr-FR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="liquidity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Opérations de Liquidité</CardTitle>
              <CardDescription>
                Réapprovisionnements (Cash In) et collectes (Cash Out) par devise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(liquidityByurrency).map(([currency, ops]) => (
                  <Card key={currency}>
                    <CardHeader>
                      <CardTitle className="text-lg">{currency}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-green-600">
                          <ArrowDownCircle className="w-4 h-4" />
                          <span className="text-sm">Cash In</span>
                        </div>
                        <span className="font-semibold text-green-600">
                          {formatAmount(ops.cashIn, currency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-red-600">
                          <ArrowUpCircle className="w-4 h-4" />
                          <span className="text-sm">Cash Out</span>
                        </div>
                        <span className="font-semibold text-red-600">
                          {formatAmount(ops.cashOut, currency)}
                        </span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Net</span>
                          <span className={`font-bold ${ops.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatAmount(ops.net, currency)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Transferts Sortants (Débits)</CardTitle>
                <CardDescription>
                  Fonds envoyés vers d'autres agences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {outgoingTransfers.slice(0, 5).map((transfer) => (
                    <div key={transfer.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium">{transfer.destination.name}</div>
                        <div className="text-sm text-gray-500">{transfer.timestamp.toLocaleDateString('fr-FR')}</div>
                      </div>
                      <div className="text-red-600 font-semibold">
                        -{formatAmount(transfer.amount, transfer.fromCurrency)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Transferts Entrants (Crédits)</CardTitle>
                <CardDescription>
                  Fonds reçus d'autres agences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {incomingTransfers.slice(0, 5).map((transfer) => (
                    <div key={transfer.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium">{transfer.origin.name}</div>
                        <div className="text-sm text-gray-500">{transfer.timestamp.toLocaleDateString('fr-FR')}</div>
                      </div>
                      <div className="text-green-600 font-semibold">
                        +{formatAmount(transfer.convertedAmount, transfer.toCurrency)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employés de l'agence</CardTitle>
              <CardDescription>
                Personnel affecté à cette agence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agencyEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        employee.role === 'manager' ? 'default' :
                        employee.role === 'cashier' ? 'secondary' :
                        'outline'
                      }>
                        {employee.role}
                      </Badge>
                      {employee.lastLogin && (
                        <div className="text-xs text-gray-500 mt-1">
                          Dernière connexion: {employee.lastLogin.toLocaleDateString('fr-FR')}
                        </div>
                      )}
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
