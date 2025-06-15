
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeeSettings } from "@/types/rates";
import { mockFees } from "@/data/ratesData";
import { Plus, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FeeItem } from "./FeeItem";

export function FeesManager() {
  const { toast } = useToast();
  const [fees, setFees] = useState<FeeSettings[]>(mockFees);
  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  const [editFeeForm, setEditFeeForm] = useState<Partial<FeeSettings>>({});
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>("all");

  const transactionTypes = [
    { value: "all", label: "Tous les types" },
    { value: "internal_transfer", label: "Transfert interne" },
    { value: "international_transfer", label: "Transfert international" },
    { value: "currency_exchange", label: "Change" },
    { value: "payment", label: "Paiement" }
  ];

  const handleEditFee = (fee: FeeSettings) => {
    setEditingFeeId(fee.id);
    setEditFeeForm(fee);
  };

  const handleSaveFee = () => {
    if (editingFeeId && editFeeForm) {
      setFees(fees.map(fee => 
        fee.id === editingFeeId 
          ? { ...fee, ...editFeeForm }
          : fee
      ));
      setEditingFeeId(null);
      setEditFeeForm({});
      toast({
        title: "Frais mis à jour",
        description: "Les modifications ont été sauvegardées",
      });
    }
  };

  const handleCancelFeeEdit = () => {
    setEditingFeeId(null);
    setEditFeeForm({});
  };

  const addNewFee = () => {
    const newFee: FeeSettings = {
      id: `fee_${Date.now()}`,
      name: `Nouveau frais ${fees.length + 1}`,
      amount: 0,
      currency: "EUR",
      isActive: true,
      description: "",
      transactionType: selectedTransactionType === "all" ? undefined : selectedTransactionType
    };
    setFees([...fees, newFee]);
    toast({
      title: "Nouveau frais ajouté",
      description: "Vous pouvez maintenant le configurer",
    });
  };

  const deleteFee = (id: string) => {
    setFees(fees.filter(fee => fee.id !== id));
    toast({
      title: "Frais supprimé",
      description: "Le frais a été supprimé avec succès",
    });
  };

  const toggleFeeActive = (id: string) => {
    setFees(fees.map(fee => 
      fee.id === id ? { ...fee, isActive: !fee.isActive } : fee
    ));
  };

  const filteredFees = selectedTransactionType === "all" 
    ? fees 
    : fees.filter(fee => !fee.transactionType || fee.transactionType === selectedTransactionType);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Gestion des Frais
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label>Type de transaction :</Label>
            <Select value={selectedTransactionType} onValueChange={setSelectedTransactionType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addNewFee}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un frais
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredFees.map((fee) => (
            <FeeItem
              key={fee.id}
              fee={fee}
              isEditing={editingFeeId === fee.id}
              editForm={editFeeForm}
              onEdit={handleEditFee}
              onSave={handleSaveFee}
              onCancel={handleCancelFeeEdit}
              onToggleActive={toggleFeeActive}
              onFormChange={setEditFeeForm}
              onDelete={deleteFee}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
