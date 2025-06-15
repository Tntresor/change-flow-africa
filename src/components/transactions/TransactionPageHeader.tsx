
import { Button } from "@/components/ui/button";
import { Download, Upload, Plus } from "lucide-react";

interface TransactionPageHeaderProps {
  transactionCount: number;
  hasFilters: boolean;
  onAddTransaction: () => void;
}

export function TransactionPageHeader({ 
  transactionCount, 
  hasFilters, 
  onAddTransaction 
}: TransactionPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600">
          {transactionCount} transaction{transactionCount !== 1 ? 's' : ''} 
          {hasFilters ? ' (filtrées)' : ''}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Exporter
        </Button>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          Importer
        </Button>
        <Button 
          onClick={onAddTransaction}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouvelle transaction
        </Button>
      </div>
    </div>
  );
}
