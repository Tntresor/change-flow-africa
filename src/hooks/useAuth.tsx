
import { useState, createContext, useContext, useEffect } from 'react';
import { User, AuthState, LoginCredentials, UserRole } from '@/types/auth';

const AuthContext = createContext<{
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  canAccessAgency: (agencyId: string) => boolean;
  hasPermission: (action: string) => boolean;
} | null>(null);

// Utilisateurs de test
const mockUsers: User[] = [
  {
    id: 'user_1',
    email: 'marie.dubois@exchangehub.com',
    firstName: 'Marie',
    lastName: 'Dubois',
    role: 'manager',
    agencyId: '1',
    agencyName: 'Agence Paris',
    isActive: true,
    permissions: [
      { action: 'create_transaction', granted: true },
      { action: 'approve_transaction', granted: true },
      { action: 'manage_liquidity', granted: true },
      { action: 'view_reports', granted: true },
      { action: 'manage_employees', granted: true }
    ]
  },
  {
    id: 'user_2',
    email: 'pierre.martin@exchangehub.com',
    firstName: 'Pierre',
    lastName: 'Martin',
    role: 'cashier',
    agencyId: '1',
    agencyName: 'Agence Paris',
    isActive: true,
    permissions: [
      { action: 'create_transaction', granted: true },
      { action: 'approve_transaction', granted: false },
      { action: 'manage_liquidity', granted: false },
      { action: 'view_reports', granted: true },
      { action: 'manage_employees', granted: false }
    ]
  },
  {
    id: 'user_3',
    email: 'admin@exchangehub.com',
    firstName: 'Jean',
    lastName: 'Administrateur',
    role: 'administrator',
    isActive: true,
    permissions: [
      { action: 'create_transaction', granted: true },
      { action: 'approve_transaction', granted: true },
      { action: 'manage_liquidity', granted: true },
      { action: 'view_reports', granted: true },
      { action: 'manage_employees', granted: true },
      { action: 'view_all_agencies', granted: true },
      { action: 'manage_system', granted: true },
      { action: 'view_global_stats', granted: true }
    ]
  },
  {
    id: 'user_4',
    email: 'business@exchangehub.com',
    firstName: 'Sophie',
    lastName: 'Business',
    role: 'business_user',
    isActive: true,
    permissions: [
      { action: 'view_reports', granted: true },
      { action: 'view_all_agencies', granted: true },
      { action: 'view_global_stats', granted: true }
    ]
  }
];

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Vérifier s'il y a un utilisateur connecté dans le localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Simulation d'une authentification
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (user && credentials.password === 'password') {
      const updatedUser = { ...user, lastLogin: new Date() };
      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false
      });
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    localStorage.removeItem('currentUser');
  };

  const canAccessAgency = (agencyId: string): boolean => {
    if (!authState.user) return false;
    
    // Administrateur et utilisateur métier peuvent voir toutes les agences
    if (authState.user.role === 'administrator' || authState.user.role === 'business_user') {
      return authState.user.permissions.some(p => p.action === 'view_all_agencies' && p.granted);
    }
    
    // Les autres utilisateurs ne peuvent voir que leur agence
    return authState.user.agencyId === agencyId;
  };

  const hasPermission = (action: string): boolean => {
    if (!authState.user) return false;
    return authState.user.permissions.some(p => p.action === action && p.granted);
  };

  return (
    <AuthContext.Provider value={{
      authState,
      login,
      logout,
      canAccessAgency,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}
