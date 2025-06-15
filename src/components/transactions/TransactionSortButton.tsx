
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface TransactionSortButtonProps {
  field: 'timestamp' | 'amount' | 'status' | 'agency';
  children: React.ReactNode;
  onSort: (field: 'timestamp' | 'amount' | 'status' | 'agency') => void;
}

export function TransactionSortButton({ field, children, onSort }: TransactionSortButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={() => onSort(field)}
      className="h-8 p-0 font-medium hover:bg-transparent"
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
