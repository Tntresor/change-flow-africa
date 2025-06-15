
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Globe } from "lucide-react";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  isDefault: boolean;
}

const defaultCurrencies: Currency[] = [
  { code: "EUR", name: "Euro", symbol: "€", isDefault: true },
  { code: "USD", name: "Dollar US", symbol: "$", isDefault: true },
  { code: "XOF", name: "Franc CFA", symbol: "F CFA", isDefault: true },
  { code: "MAD", name: "Dirham Marocain", symbol: "DH", isDefault: true },
  { code: "AED", name: "Dirham des Émirats", symbol: "د.إ", isDefault: true },
  { code: "GBP", name: "Livre Sterling", symbol: "£", isDefault: false },
  { code: "CAD", name: "Dollar Canadien", symbol: "C$", isDefault: false },
];

interface CurrencyManagementProps {
  primaryCurrency: string;
  secondaryCurrency: string;
  onPrimaryCurrencyChange: (currency: string) => void;
  onSecondaryCurrencyChange: (currency: string) => void;
}

export function CurrencyManagement({
  primaryCurrency,
  secondaryCurrency,
  onPrimaryCurrencyChange,
  onSecondaryCurrencyChange,
}: CurrencyManagementProps) {
  const [currencies, setCurrencies] = useState<Currency[]>(defaultCurrencies);
  const [newCurrency, setNewCurrency] = useState({ code: "", name: "", symbol: "" });

  const addCurrency = () => {
    if (newCurrency.code && newCurrency.name && newCurrency.symbol) {
      const currency: Currency = {
        ...newCurrency,
        code: newCurrency.code.toUpperCase(),
        isDefault: false,
      };
      setCurrencies([...currencies, currency]);
      setNewCurrency({ code: "", name: "", symbol: "" });
    }
  };

  const removeCurrency = (code: string) => {
    setCurrencies(currencies.filter(c => c.code !== code || c.isDefault));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Devises d'affichage
          </CardTitle>
          <CardDescription>
            Configurez les devises pour l'affichage du volume mensuel des agences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Devise principale</Label>
              <Select value={primaryCurrency} onValueChange={onPrimaryCurrencyChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Devise secondaire</Label>
              <Select value={secondaryCurrency} onValueChange={onSecondaryCurrencyChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des devises</CardTitle>
          <CardDescription>Ajoutez ou supprimez des devises disponibles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Devises disponibles</h4>
            <div className="flex flex-wrap gap-2">
              {currencies.map((currency) => (
                <div key={currency.code} className="flex items-center gap-2">
                  <Badge variant={currency.isDefault ? "default" : "secondary"}>
                    {currency.code} - {currency.symbol}
                  </Badge>
                  {!currency.isDefault && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCurrency(currency.code)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-4">Ajouter une nouvelle devise</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Code (ex: JPY)</Label>
                <Input
                  value={newCurrency.code}
                  onChange={(e) => setNewCurrency({...newCurrency, code: e.target.value})}
                  placeholder="JPY"
                />
              </div>
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  value={newCurrency.name}
                  onChange={(e) => setNewCurrency({...newCurrency, name: e.target.value})}
                  placeholder="Yen Japonais"
                />
              </div>
              <div className="space-y-2">
                <Label>Symbole</Label>
                <Input
                  value={newCurrency.symbol}
                  onChange={(e) => setNewCurrency({...newCurrency, symbol: e.target.value})}
                  placeholder="¥"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addCurrency} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
