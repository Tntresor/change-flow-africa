
import { ReconciliationEntry, ReconciliationReport, ReconciliationTransaction, AuditTrailEntry } from "@/types/reconciliation";

// Transactions de réconciliation
export const mockReconciliationTransactions: ReconciliationTransaction[] = [
  {
    transactionId: "txn_rec_001",
    type: "transaction",
    amount: 150.00,
    currency: "EUR",
    timestamp: new Date("2024-01-15T09:30:00"),
    impact: "debit"
  },
  {
    transactionId: "txn_rec_002", 
    type: "transaction",
    amount: 75.50,
    currency: "EUR",
    timestamp: new Date("2024-01-15T10:15:00"),
    impact: "credit"
  },
  {
    transactionId: "cash_in_001",
    type: "cash_in",
    amount: 2000.00,
    currency: "EUR",
    timestamp: new Date("2024-01-15T11:00:00"),
    impact: "credit"
  },
  {
    transactionId: "cash_out_001",
    type: "cash_out", 
    amount: 500.00,
    currency: "EUR",
    timestamp: new Date("2024-01-15T14:30:00"),
    impact: "debit"
  },
  {
    transactionId: "txn_rec_003",
    type: "transaction",
    amount: 320.75,
    currency: "USD",
    timestamp: new Date("2024-01-15T15:45:00"),
    impact: "debit"
  },
  {
    transactionId: "cash_in_002",
    type: "cash_in",
    amount: 1500.00,
    currency: "CHF",
    timestamp: new Date("2024-01-15T16:20:00"),
    impact: "credit"
  }
];

// Entrées de réconciliation
export const mockReconciliationEntries: ReconciliationEntry[] = [
  {
    id: "rec_entry_001",
    agentId: "emp_1",
    agentName: "Marie Dubois",
    agencyId: "1",
    date: new Date("2024-01-15"),
    tillId: "till_001",
    currency: "EUR",
    theoreticalBalance: 5000.00,
    actualCash: 4995.00,
    variance: -5.00,
    transactions: mockReconciliationTransactions.slice(0, 2),
    status: "variance_documented",
    notes: "Écart de 5€ constaté - pièce défectueuse retirée"
  },
  {
    id: "rec_entry_002",
    agentId: "emp_2",
    agentName: "Jean Martin", 
    agencyId: "1",
    date: new Date("2024-01-15"),
    tillId: "till_002",
    currency: "EUR",
    theoreticalBalance: 2800.75,
    actualCash: 2800.75,
    variance: 0.00,
    transactions: mockReconciliationTransactions.slice(2, 4),
    status: "balanced"
  },
  {
    id: "rec_entry_003",
    agentId: "emp_3",
    agentName: "Sophie Laurent",
    agencyId: "2", 
    date: new Date("2024-01-15"),
    tillId: "till_003",
    currency: "EUR",
    theoreticalBalance: 6500.00,
    actualCash: 6520.00,
    variance: 20.00,
    transactions: [mockReconciliationTransactions[0]],
    status: "variance_unresolved",
    notes: "Excédent de 20€ - en cours d'investigation"
  },
  {
    id: "rec_entry_004",
    agentId: "emp_3",
    agentName: "Sophie Laurent",
    agencyId: "2", 
    date: new Date("2024-01-15"),
    tillId: "till_004",
    currency: "CHF",
    theoreticalBalance: 2200.25,
    actualCash: 2200.25,
    variance: 0.00,
    transactions: [mockReconciliationTransactions[5]],
    status: "balanced"
  }
];

// Piste d'audit
export const mockAuditTrailEntries: AuditTrailEntry[] = [
  {
    id: "audit_001",
    timestamp: new Date("2024-01-15T18:00:00"),
    action: "Reconciliation started",
    performedBy: "Marie Dubois",
    details: "Début de la réconciliation quotidienne pour l'agence Paris Centre",
    relatedTransactionId: "rec_entry_001"
  },
  {
    id: "audit_002",
    timestamp: new Date("2024-01-15T18:15:00"),
    action: "Variance documented",
    performedBy: "Marie Dubois", 
    details: "Écart de -5.00 EUR documenté pour la caisse till_001",
    relatedTransactionId: "rec_entry_001"
  },
  {
    id: "audit_003",
    timestamp: new Date("2024-01-15T18:30:00"),
    action: "Reconciliation completed",
    performedBy: "Jean Martin",
    details: "Réconciliation terminée - statut équilibré pour till_002",
    relatedTransactionId: "rec_entry_002"
  },
  {
    id: "audit_004",
    timestamp: new Date("2024-01-15T19:00:00"),
    action: "Variance investigation started",
    performedBy: "Sophie Laurent",
    details: "Investigation démarrée pour l'excédent de 20.00 EUR",
    relatedTransactionId: "rec_entry_003"
  },
  {
    id: "audit_005",
    timestamp: new Date("2024-01-15T19:15:00"),
    action: "Reconciliation completed",
    performedBy: "Sophie Laurent",
    details: "Réconciliation CHF terminée - statut équilibré pour till_004",
    relatedTransactionId: "rec_entry_004"
  }
];

// Rapports de réconciliation
export const mockReconciliationReports: ReconciliationReport[] = [
  {
    id: "report_001",
    agencyId: "1",
    agencyName: "Agence Paris Centre",
    date: new Date("2024-01-15"),
    entries: mockReconciliationEntries.filter(e => e.agencyId === "1"),
    totalVariance: {
      "EUR": -5.00,
      "USD": 0.00
    },
    status: "pending_review",
    auditTrail: mockAuditTrailEntries.slice(0, 3)
  },
  {
    id: "report_002",
    agencyId: "2",
    agencyName: "Agence Lyon",
    date: new Date("2024-01-15"),
    entries: mockReconciliationEntries.filter(e => e.agencyId === "2"),
    totalVariance: {
      "EUR": 20.00,
      "CHF": 0.00
    },
    status: "pending_review", // Changé de completed à pending_review à cause de l'écart EUR
    auditTrail: mockAuditTrailEntries.slice(3, 5)
  }
];
