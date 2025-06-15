
export interface AgencyLiquidity {
  id: string;
  agencyId: string;
  agencyName: string;
  balances: CurrencyBalance[];
  lastUpdated: Date;
  alerts: LiquidityAlert[];
}

export interface CurrencyBalance {
  currency: string;
  balance: number;
  minThreshold: number;
  maxThreshold: number;
  status: 'critical' | 'low' | 'normal' | 'high';
  reservedAmount: number; // Montant réservé pour les transactions en cours
  availableAmount: number; // balance - reservedAmount
}

export interface LiquidityAlert {
  id: string;
  type: 'low_balance' | 'high_balance' | 'threshold_breach' | 'manual';
  currency: string;
  currentBalance: number;
  threshold: number;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface PoolLiquidity {
  currency: string;
  totalBalance: number;
  totalReserved: number;
  totalAvailable: number;
  agencies: {
    agencyId: string;
    agencyName: string;
    balance: number;
    available: number;
    percentage: number;
  }[];
  rebalancingRules: RebalancingRule[];
}

export interface RebalancingRule {
  id: string;
  currency: string;
  triggerType: 'automatic' | 'manual' | 'scheduled';
  minAgencyBalance: number;
  maxAgencyBalance: number;
  targetPercentage: number;
  isActive: boolean;
}

export interface LiquidityTransfer {
  id: string;
  fromAgencyId: string;
  toAgencyId: string;
  currency: string;
  amount: number;
  reason: string;
  status: 'pending' | 'completed' | 'rejected';
  initiatedBy: string;
  timestamp: Date;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  agencyId: string;
  agencyName: string;
  role: 'manager' | 'cashier' | 'agent' | 'supervisor';
  isActive: boolean;
  permissions: EmployeePermission[];
  hireDate: Date;
  lastLogin?: Date;
}

export interface EmployeePermission {
  action: 'create_transaction' | 'approve_transaction' | 'manage_liquidity' | 'view_reports' | 'manage_employees';
  granted: boolean;
}
