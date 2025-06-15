
import { KycStatus } from "@/types/customer";

export const kycStatusVariant: Record<KycStatus, "default" | "secondary" | "destructive" | "outline"> = {
    verified: 'default',
    pending: 'secondary',
    rejected: 'destructive',
    none: 'outline'
};

export const kycStatusText: Record<KycStatus, string> = {
    verified: 'Vérifié',
    pending: 'En attente',
    rejected: 'Rejeté',
    none: 'Aucun'
};
