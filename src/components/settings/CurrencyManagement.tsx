
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Globe } from "lucide-react";
import { Currency } from "./hooks/useCurrencyManager";

interface CurrencyManagementProps {
  primaryCurrency: string;
  secondaryCurrency: string;
  onPrimaryCurrencyChange: (currency: string) => void;
  onSecondaryCurrencyChange: (currency: string) => void;
  currencies: Currency[];
  newCurrency: { code: string; name: string; symbol: string; };
  setNewCurrency: (currency: { code: string; name: string; symbol: string; }) => void;
  addCurrency: () => void;
  removeCurrency: (code: string) => void;
}

export function CurrencyManagement({
  primaryCurrency,
  secondaryCurrency,
  onPrimaryCurrencyChange,
  onSecondaryCurrencyChange,
  currencies,
  newCurrency,
  setNewCurrency,
  addCurrency,
  removeCurrency,
}: CurrencyManagementProps) {
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
