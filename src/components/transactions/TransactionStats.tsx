
import { Transaction } from "@/types/transaction";

interface TransactionStatsProps {
  transactions: Transaction[];
}

export function TransactionStats({ transactions }: TransactionStatsProps) {
  const completedCount = transactions.filter(t => t.status === 'completed').length;
  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-sm text-gray-500">Total transactions</div>
        <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-sm text-gray-500">Terminées</div>
        <div className="text-2xl font-bold text-green-600">{completedCount}</div>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-sm text-gray-500">En attente</div>
        <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-sm text-gray-500">Volume total</div>
        <div className="text-2xl font-bold text-gray-900">
          {totalVolume.toLocaleString()}€
        </div>
      </div>
    </div>
  );
}
