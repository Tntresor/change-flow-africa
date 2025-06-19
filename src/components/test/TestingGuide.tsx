
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useState } from "react";

export function TestingGuide() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const testSteps = [
    {
      id: "maker-checker",
      title: "Test Maker-Checker",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      steps: [
        "Sélectionnez 'Agence Paris Centre'",
        "Type : 'Change', Montant : 6000 EUR (dépasse la limite)",
        "Cliquez 'Vérifier si approbation requise'",
        "Cliquez 'Soumettre pour approbation'",
        "Approuvez ou rejetez avec commentaires"
      ]
    },
    {
      id: "cancellation",
      title: "Test Annulation",
      icon: <AlertCircle className="w-5 h-5 text-orange-600" />,
      steps: [
        "Rôle : 'Superviseur', Agence : 'Agence Paris'",
        "Sélectionnez une transaction dans la liste",
        "Cliquez 'Vérifier les permissions'",
        "Saisissez une raison d'annulation (>10 caractères)",
        "Cliquez 'Annuler la transaction'"
      ]
    },
    {
      id: "ledger",
      title: "Test Micro-Ledger",
      icon: <Info className="w-5 h-5 text-blue-600" />,
      steps: [
        "Sélectionnez une transaction",
        "Cliquez 'Créer écritures comptables'",
        "Cliquez 'Créer écritures d'annulation'",
        "Cliquez 'Calculer balances agences'",
        "Cliquez 'Consolider' (vérifiez la console)"
      ]
    }
  ];

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Guide de test</h3>
        <Badge variant="outline">Étape par étape</Badge>
      </div>
      
      <div className="space-y-4">
        {testSteps.map((test) => (
          <Collapsible
            key={test.id}
            open={openSections[test.id]}
            onOpenChange={() => toggleSection(test.id)}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2">
                {test.icon}
                <span className="font-medium">{test.title}</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSections[test.id] ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 p-3 bg-gray-50/50 rounded-lg">
              <ol className="space-y-2">
                {test.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800">Conseils :</p>
            <ul className="mt-1 list-disc list-inside text-yellow-700 space-y-1">
              <li>Ouvrez la console développeur (F12) pour voir les logs détaillés</li>
              <li>Testez avec différents rôles utilisateur pour valider les permissions</li>
              <li>Vérifiez que les montants et devises s'affichent correctement</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
