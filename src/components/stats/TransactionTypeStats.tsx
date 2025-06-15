
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import { ArrowRightLeft, Send, CreditCard, Building } from "lucide-react";

interface TransactionTypeStatsProps {
  transactions: Transaction[];
}

export function TransactionTypeStats({ transactions }: TransactionTypeStatsProps) {
  const getStatsByType = () => {
    const stats = {
      internal_transfer: { count: 0, volume: 0, icon: Building, label: "Transferts internes" },
      international_transfer: { count: 0, volume: 0, icon: Send, label: "Transferts internationaux" },
      currency_exchange: { count: 0, volume: 0, icon: ArrowRightLeft, label: "Changes" },
      payment: { count: 0, volume: 0, icon: CreditCard, label: "Paiements" }
    };

    transactions.forEach(transaction => {
      if (stats[transaction.type]) {
        stats[transaction.type].count++;
        stats[transaction.type].volume += transaction.amount;
      }
    });

    return stats;
  };

  const stats = getStatsByType();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(stats).map(([type, data]) => {
        const Icon = data.icon;
        return (
          <Card key={type}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {data.label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.count}</div>
              <p className="text-xs text-muted-foreground">
                Volume: {data.volume.toLocaleString()}€
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
