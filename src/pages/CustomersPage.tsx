
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomers } from "@/hooks/useCustomers";
import { CustomersTable } from "@/components/customers/CustomersTable";
import { Users } from "lucide-react";

export default function CustomersPage() {
    const { customers } = useCustomers();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
                    <p className="text-gray-600">
                        {customers.length} client{customers.length !== 1 ? 's' : ''} trouvé{customers.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <Users className="w-5 h-5" />
                       Liste des clients
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CustomersTable customers={customers} />
                </CardContent>
            </Card>
        </div>
    );
}
