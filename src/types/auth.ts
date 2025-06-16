
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  agencyId?: string; // undefined pour les utilisateurs siège
  agencyName?: string;
  isActive: boolean;
  lastLogin?: Date;
  permissions: UserPermission[];
}

export type UserRole = 
  | 'agent'           // Agent en agence
  | 'cashier'         // Caissier en agence  
  | 'supervisor'      // Superviseur en agence
  | 'manager'         // Manager en agence
  | 'business_user'   // Utilisateur métier au siège
  | 'administrator';  // Administrateur au siège

export interface UserPermission {
  action: PermissionAction;
  granted: boolean;
}

export type PermissionAction = 
  | 'create_transaction'
  | 'approve_transaction'
  | 'manage_liquidity'
  | 'view_reports'
  | 'manage_employees'
  | 'view_all_agencies'     // Nouveau : voir toutes les agences
  | 'manage_system'         // Nouveau : gestion système
  | 'view_global_stats';    // Nouveau : statistiques globales

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
