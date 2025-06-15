
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Building } from "lucide-react";

interface AgencyVolume {
  agencyName: string;
  location: string;
  monthlyVolume: number;
  previousMonthVolume: number;
  transactionCount: number;
}

interface AgencyVolumeDisplayProps {
  primaryCurrency: string;
  secondaryCurrency: string;
  agencies: AgencyVolume[];
}

const mockExchangeRates = {
  XOF: { EUR: 655.957, USD: 600.0, MAD: 60.0, AED: 2205.0 },
  MAD: { EUR: 10.85, USD: 10.0, XOF: 0.0167, AED: 36.75 },
  AED: { EUR: 0.295, USD: 0.272, XOF: 0.00045, MAD: 0.027 },
  EUR: { XOF: 655.957, MAD: 10.85, AED: 4.02 },
  USD: { XOF: 600.0, MAD: 10.0, AED: 3.67 },
};

export function AgencyVolumeDisplay({ 
  primaryCurrency, 
  secondaryCurrency, 
  agencies 
}: AgencyVolumeDisplayProps) {
  
  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    
    // Conversion simple via EUR comme devise de base
    if (fromCurrency === "EUR") {
      return amount * (mockExchangeRates[toCurrency as keyof typeof mockExchangeRates]?.EUR || 1);
    }
    
    if (toCurrency === "EUR") {
      return amount / (mockExchangeRates[fromCurrency as keyof typeof mockExchangeRates]?.EUR || 1);
    }
    
    // Conversion via EUR
    const amountInEur = amount / (mockExchangeRates[fromCurrency as keyof typeof mockExchangeRates]?.EUR || 1);
    return amountInEur * (mockExchangeRates[toCurrency as keyof typeof mockExchangeRates]?.EUR || 1);
  };

  const formatCurrency = (amount: number, currency: string): string => {
    const symbols = {
      EUR: "€",
      USD: "$",
      XOF: "F CFA",
      MAD: "DH",
      AED: "د.إ",
      GBP: "£",
      CAD: "C$"
    };
    
    const symbol = symbols[currency as keyof typeof symbols] || currency;
    
    if (currency === "XOF") {
      return `${Math.round(amount).toLocaleString('fr-FR')} ${symbol}`;
    }
    
    return `${amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })} ${symbol}`;
  };

  const calculateGrowth = (current: number, previous: number): number => {
    return previous > 0 ? ((current - previous) / previous) * 100 : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Volume Mensuel des Agences
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="outline">{primaryCurrency}</Badge>
          <Badge variant="outline">{secondaryCurrency}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agencies.map((agency) => {
            const primaryAmount = convertCurrency(agency.monthlyVolume, "EUR", primaryCurrency);
            const secondaryAmount = convertCurrency(agency.monthlyVolume, "EUR", secondaryCurrency);
            const growth = calculateGrowth(agency.monthlyVolume, agency.previousMonthVolume);
            
            return (
              <div key={agency.agencyName} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{agency.agencyName}</h4>
                    <p className="text-sm text-gray-600">{agency.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {growth > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Volume ({primaryCurrency})</p>
                    <p className="text-lg font-semibold">{formatCurrency(primaryAmount, primaryCurrency)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Volume ({secondaryCurrency})</p>
                    <p className="text-lg font-semibold">{formatCurrency(secondaryAmount, secondaryCurrency)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transactions</p>
                    <p className="text-lg font-semibold">{agency.transactionCount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
