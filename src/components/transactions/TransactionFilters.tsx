
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Search, Filter, X } from "lucide-react";
import { DateRange } from "react-day-picker";

interface TransactionFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  status: string;
  currency: string;
  agency: string;
  dateRange: DateRange | undefined;
}

export function TransactionFilters({ onFiltersChange }: TransactionFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    currency: "all",
    agency: "all",
    dateRange: undefined,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: "",
      status: "all",
      currency: "all",
      agency: "all",
      dateRange: undefined,
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.search || filters.status !== "all" || 
    filters.currency !== "all" || filters.agency !== "all" || filters.dateRange;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Barre de recherche principale */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par ID, client, ou montant..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtres avancés
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="gap-2">
              <X className="w-4 h-4" />
              Effacer
            </Button>
          )}
        </div>

        {/* Filtres avancés */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Statut</label>
              <Select
                value={filters.status}
                onValueChange={(value) => updateFilters({ status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                  <SelectItem value="rejected">Rejetée</SelectItem>
                  <SelectItem value="offline">Hors ligne</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Devise</label>
              <Select
                value={filters.currency}
                onValueChange={(value) => updateFilters({ currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les devises</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="XOF">XOF</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Agence</label>
              <Select
                value={filters.agency}
                onValueChange={(value) => updateFilters({ agency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les agences</SelectItem>
                  <SelectItem value="paris">Paris</SelectItem>
                  <SelectItem value="dakar">Dakar</SelectItem>
                  <SelectItem value="london">Londres</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Période</label>
              <DatePickerWithRange
                dateRange={filters.dateRange}
                onDateRangeChange={(range) => updateFilters({ dateRange: range })}
              />
            </div>
          </div>
        )}

        {/* Badges des filtres actifs */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Recherche: {filters.search}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilters({ search: "" })}
                />
              </Badge>
            )}
            {filters.status !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Statut: {filters.status}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilters({ status: "all" })}
                />
              </Badge>
            )}
            {filters.currency !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Devise: {filters.currency}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilters({ currency: "all" })}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
