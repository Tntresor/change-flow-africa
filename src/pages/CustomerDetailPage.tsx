
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomers } from '@/hooks/useCustomers';
import { Customer } from '@/types/customer';
import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, TrendingUp, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { kycStatusVariant, kycStatusText } from '@/lib/kycUtils';
import { CustomerTransactionHistory } from '@/components/customers/CustomerTransactionHistory';
import { CustomerKycLimits } from '@/components/customers/CustomerKycLimits';

export default function CustomerDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getCustomerById, getTransactionsByCustomerId } = useCustomers();
    const [customer, setCustomer] = useState<Customer | undefined>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        if (id) {
            const foundCustomer = getCustomerById(id);
            setCustomer(foundCustomer);
            if (foundCustomer) {
                const customerTransactions = getTransactionsByCustomerId(id);
                setTransactions(customerTransactions);
            }
        }
    }, [id, getCustomerById, getTransactionsByCustomerId]);

    if (!customer) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Client non trouvé ou en cours de chargement...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Button variant="outline" onClick={() => navigate('/customers')} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour à la liste des clients
            </Button>
            
            <div className="grid md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-2 mb-1">
                                        <User className="w-6 h-6" />
                                        {customer.name}
                                    </CardTitle>
                                    <CardDescription>
                                        ID Client: {customer.id}
                                    </CardDescription>
                                </div>
                                <Badge variant={kycStatusVariant[customer.kycStatus]}>
                                    {kycStatusText[customer.kycStatus]}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2 md:grid-cols-2">
                                <p><span className="font-semibold text-gray-600">Téléphone:</span> {customer.phone || 'N/A'}</p>
                                <p><span className="font-semibold text-gray-600">Email:</span> {customer.email || 'N/A'}</p>
                                <p><span className="font-semibold text-gray-600">Adresse:</span> {customer.address || 'N/A'}</p>
                                <p><span className="font-semibold text-gray-600">Pièce d'identité:</span> {customer.idNumber || 'N/A'}</p>
                            </div>
                            <div>
                                <p><span className="font-semibold text-gray-600">Dernière transaction:</span> {customer.lastTransactionDate ? format(customer.lastTransactionDate, 'dd/MM/yyyy HH:mm') : 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="w-5 h-5" />
                                Historique des transactions
                            </CardTitle>
                            <CardDescription>Liste des transactions pour ce client.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CustomerTransactionHistory transactions={transactions} customerId={customer.id} />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                             <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Score de Risque
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{customer.riskScore}</p>
                            <p className="text-sm text-gray-500">Score de risque du client.</p>
                        </CardContent>
                    </Card>
                    <CustomerKycLimits kycStatus={customer.kycStatus} />
                </div>
            </div>
        </div>
    );
}
