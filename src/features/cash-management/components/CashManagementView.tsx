
import { useCashManagementTest } from "@/hooks/useCashManagementTest";
import { AgencyCashView } from "./AgencyCashView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

export function CashManagementView() {
  const { cashSummaries, processCashTransfer } = useCashManagementTest();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion de caisse</h2>
        <p className="text-gray-600">
          Vue consolidée de la gestion de caisse par agence
        </p>
      </div>

      {cashSummaries.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune donnée de caisse</h3>
            <p className="text-gray-600">Les données de gestion de caisse s'afficheront ici une fois configurées.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {cashSummaries.map((cashSummary, index) => (
            <AgencyCashView
              key={cashSummary.agencyId}
              cashSummary={cashSummary}
              onCashTransfer={(request) => processCashTransfer(index, request)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
