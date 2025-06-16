
import { TrendingUp, TrendingDown } from "lucide-react";
import { ExchangeRateSettings } from "@/types/rates";

interface ExchangeRateDisplayInfoProps {
  rate: ExchangeRateSettings;
  spreadPercentage: number;
}

export function ExchangeRateDisplayInfo({ rate, spreadPercentage }: ExchangeRateDisplayInfoProps) {
  return (
    <div className="grid grid-cols-5 gap-4 text-sm">
      <div>
        <span className="text-gray-500">Taux de base (Mid):</span>
        <div className="font-semibold">{rate.baseRate.toFixed(4)}</div>
      </div>
      <div className="flex items-center gap-1">
        <TrendingDown className="w-3 h-3 text-red-600" />
        <div>
          <span className="text-gray-500">Taux Bid:</span>
          <div className="font-semibold text-red-600">{rate.bidRate.toFixed(4)}</div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <TrendingUp className="w-3 h-3 text-green-600" />
        <div>
          <span className="text-gray-500">Taux Ask:</span>
          <div className="font-semibold text-green-600">{rate.askRate.toFixed(4)}</div>
        </div>
      </div>
      <div>
        <span className="text-gray-500">Spread total:</span>
        <div className="font-semibold text-orange-600">{rate.totalSpread.toFixed(4)}</div>
      </div>
      <div>
        <span className="text-gray-500">Spread (%):</span>
        <div className="font-semibold text-blue-600">{spreadPercentage.toFixed(2)}%</div>
      </div>
    </div>
  );
}
