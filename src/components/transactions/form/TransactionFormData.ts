
import * as z from "zod";

export const transactionSchema = z.object({
  amount: z.number().min(0.01, "Le montant doit être supérieur à 0"),
  fromCurrency: z.string().min(1, "Devise source requise"),
  toCurrency: z.string().min(1, "Devise de destination requise"),
  agencyId: z.string().min(1, "Agence requise"),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  category: z.string().min(1, "Catégorie requise"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export const mockAgencies = [
  { id: "1", name: "Agence Paris Centre", code: "PAR01" },
  { id: "2", name: "Agence Lyon", code: "LYO01" },
  { id: "3", name: "Agence Marseille", code: "MAR01" },
];

export const mockCategories = [
  { id: "1", name: "Virement", color: "bg-blue-500", icon: "arrow-right" },
  { id: "2", name: "Change", color: "bg-green-500", icon: "exchange" },
  { id: "3", name: "Transfert", color: "bg-purple-500", icon: "send" },
];
