
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/transaction";
import { Clock, CheckCircle, XCircle, Wifi, WifiOff, ArrowRight, Building, Globe, Users, User, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TransactionCardProps {
  transaction: Transaction;
}

const statusConfig = {
  pending: { label: "En attente", color: "bg-orange-100 text-orange-800", icon: Clock },
  completed: { label: "Terminée", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejetée", color: "bg-red-100 text-red-800", icon: XCircle },
  offline: { label: "Hors ligne", color: "bg-gray-100 text-gray-800", icon: WifiOff }
};

const typeConfig = {
  internal_transfer: { label: "Transfert interne", color: "bg-blue-500", icon: Building },
  international_transfer: { label: "Transfert international", color: "bg-purple-500", icon: Globe },
  currency_exchange: { label: "Change", color: "bg-green-500", icon: ArrowRight },
  payment: { label: "Paiement", color: "bg-orange-500", icon: Users }
};

export function TransactionCard({ transaction }: TransactionCardProps) {
  const status = statusConfig[transaction.status];
  const type = typeConfig[transaction.type];
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;
  const totalCosts = (transaction.commission?.totalCommission || 0) + (transaction.fees || 0);

  return (
    <Card className="p-4 border-l-4" style={{borderLeftColor: type.color.replace('bg-', '#')}}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${type.color} rounded-full flex items-center justify-center text-white text-sm`}>
            <TypeIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{type.label}</p>
            <p className="text-sm text-gray-500">ID: {transaction.prefixId || transaction.id.slice(0, 8)}</p>
          </div>
        </div>
        <Badge className={status.color}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {status.label}
        </Badge>
      </div>
      
      {/* Devises et montants */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-sm text-gray-500">Montant envoyé</p>
          <p className="font-semibold text-gray-900">
            {transaction.amount.toLocaleString()} {transaction.fromCurrency}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Montant reçu</p>
          <p className="font-semibold text-gray-900">
            {transaction.convertedAmount.toLocaleString()} {transaction.toCurrency}
          </p>
        </div>
      </div>

      {/* Itinéraire */}
      <div className="mb-3 p-2 bg-gray-50 rounded">
        <div className="flex items-center justify-between text-sm">
          <div className="text-center">
            <div className="font-medium">{transaction.origin.name}</div>
            <div className="text-gray-500">{transaction.origin.country}</div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className="text-center">
            <div className="font-medium">{transaction.destination.name}</div>
            <div className="text-gray-500">{transaction.destination.country}</div>
          </div>
        </div>
      </div>

      {/* Client envoyeur et récepteur */}
      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div>
          <p className="text-gray-500">Envoyeur</p>
          <p className="font-medium">{transaction.sender.name}</p>
        </div>
        <div>
          <p className="text-gray-500">Récepteur</p>
          <p className="font-medium">{transaction.receiver.name}</p>
        </div>
      </div>
      
      {/* Agent & Agence */}
      {transaction.agent && (
        <div className="border-t pt-3 mt-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Traité par (Agent)</p>
              <div className="flex items-center gap-1.5 mt-1">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{transaction.agent.name} <span className="text-gray-500 font-normal">({transaction.agent.role})</span></span>
              </div>
            </div>
            <div>
              <p className="text-gray-500">Agence</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{transaction.agencyName}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Frais et commissions */}
      <div className="border-t pt-3 mt-3">
        <h5 className="text-sm font-medium mb-2 text-gray-800">Détail des coûts</h5>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Commission</p>
            <p className="font-semibold">
              {(transaction.commission?.totalCommission || 0).toLocaleString()} {transaction.fromCurrency}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Frais</p>
            <p className="font-semibold">
              {(transaction.fees || 0).toLocaleString()} {transaction.fromCurrency}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Total prélevé</p>
            <p className="font-semibold">
              {totalCosts.toLocaleString()} {transaction.fromCurrency}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm border-t pt-3 mt-3">
        <span className="text-gray-500">
          {format(transaction.timestamp, "PPp", { locale: fr })}
        </span>
        <div className="flex items-center gap-2">
          {transaction.isOffline ? (
            <WifiOff className="w-3 h-3 text-gray-400" />
          ) : (
            <Wifi className="w-3 h-3 text-green-500" />
          )}
          <span className="text-gray-600">
            Taux: {transaction.finalRate.toFixed(4)} (spread: {transaction.spread.toFixed(4)})
          </span>
        </div>
      </div>
    </Card>
  );
}
