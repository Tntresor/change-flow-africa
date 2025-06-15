
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KycStatus } from "@/types/customer";
import { ShieldCheck, ShieldAlert, ShieldOff, ShieldQuestion } from "lucide-react";

interface KycLimits {
    daily: number;
    monthly: number;
    transaction: number;
}

const kycLimits: Record<KycStatus, KycLimits> = {
    verified: { daily: 5000, monthly: 20000, transaction: 2500 },
    pending: { daily: 500, monthly: 1500, transaction: 500 },
    rejected: { daily: 0, monthly: 0, transaction: 0 },
    none: { daily: 150, monthly: 500, transaction: 150 },
};

const kycLimitIcons: Record<KycStatus, React.ElementType> = {
    verified: ShieldCheck,
    pending: ShieldQuestion,
    rejected: ShieldOff,
    none: ShieldAlert
};

interface CustomerKycLimitsProps {
    kycStatus: KycStatus;
}

export function CustomerKycLimits({ kycStatus }: CustomerKycLimitsProps) {
    const limits = kycLimits[kycStatus];
    const Icon = kycLimitIcons[kycStatus];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Icon className="w-6 h-6" />
                    <CardTitle>Limites de transaction</CardTitle>
                </div>
                <CardDescription>Basées sur le statut KYC actuel du client.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type de limite</TableHead>
                            <TableHead className="text-right">Montant (EUR)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Par transaction</TableCell>
                            <TableCell className="text-right font-medium">{limits.transaction.toLocaleString()} €</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Journalière</TableCell>
                            <TableCell className="text-right font-medium">{limits.daily.toLocaleString()} €</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Mensuelle</TableCell>
                            <TableCell className="text-right font-medium">{limits.monthly.toLocaleString()} €</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
