
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle } from "lucide-react";

const stats = [
  {
    title: "Transactions aujourd'hui",
    value: "247",
    change: "+12%",
    changeType: "positive" as const,
    icon: ArrowUpRight,
    color: "text-green-600"
  },
  {
    title: "Volume total (24h)",
    value: "€156,432",
    change: "+8.5%",
    changeType: "positive" as const, 
    icon: ArrowUpRight,
    color: "text-blue-600"
  },
  {
    title: "En attente",
    value: "23",
    change: "-15%",
    changeType: "negative" as const,
    icon: Clock,
    color: "text-orange-600"
  },
  {
    title: "Taux de réussite",
    value: "98.7%",
    change: "+0.3%",
    changeType: "positive" as const,
    icon: CheckCircle,
    color: "text-green-600"
  }
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs hier</span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
