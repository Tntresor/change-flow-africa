
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/types/customer";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { kycStatusText, kycStatusVariant } from "@/lib/kycUtils";

interface CustomersTableProps {
    customers: Customer[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
    const navigate = useNavigate();

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
                    <TableRow 
                        key={customer.id}
                        onClick={() => navigate(`/customers/${customer.id}`)}
                        className="cursor-pointer hover:bg-gray-50"
                    >
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
