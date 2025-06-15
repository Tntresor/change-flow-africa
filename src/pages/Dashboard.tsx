
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentTransactions } from "@/components/transactions/RecentTransactions";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre activité d'échange de devises</p>
      </div>
      
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        
        <div className="space-y-6">
          {/* Placeholder pour d'autres widgets */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Taux de change</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">EUR → XOF</span>
                <span className="font-semibold">655.957</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">USD → XOF</span>
                <span className="font-semibold">600.5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">GBP → XOF</span>
                <span className="font-semibold">750.2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
