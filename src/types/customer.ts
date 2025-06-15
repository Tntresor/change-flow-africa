
import { CustomerInfo } from './transaction';

export type KycStatus = 'verified' | 'pending' | 'rejected' | 'none';

export interface Customer extends CustomerInfo {
    id: string; // can be phone number or a generated UUID
    kycStatus: KycStatus;
    lastTransactionDate: Date;
}
