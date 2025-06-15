
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Customer, KycStatus } from "@/types/customer";
import { format } from "date-fns";

interface CustomersTableProps {
    customers: Customer[];
}

const kycStatusVariant: Record<KycStatus, "default" | "secondary" | "destructive" | "outline"> = {
    verified: 'default',
    pending: 'secondary',
    rejected: 'destructive',
    none: 'outline'
};

const kycStatusText: Record<KycStatus, string> = {
    verified: 'Vérifié',
    pending: 'En attente',
    rejected: 'Rejeté',
    none: 'Aucun'
};

export function CustomersTable({ customers }: CustomersTableProps) {
    if (customers.length === 0) {
        return <p className="text-center text-gray-500 py-8">Aucun client trouvé.</p>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Statut KYC</TableHead>
                    <TableHead>Dernière transaction</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {customers.map((customer) => (
                    <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.phone || 'N/A'}</TableCell>
                        <TableCell>{customer.email || 'N/A'}</TableCell>
                        <TableCell>
                            <Badge variant={kycStatusVariant[customer.kycStatus]}>
                                {kycStatusText[customer.kycStatus]}
                            </Badge>
                        </TableCell>
                        <TableCell>{format(customer.lastTransactionDate, 'dd/MM/yyyy')}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
