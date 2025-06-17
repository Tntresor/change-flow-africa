import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().min(0.01, "Le montant doit être supérieur à 0"),
  fromCurrency: z.string().min(1, "La devise source est obligatoire"),
  toCurrency: z.string().min(1, "La devise de destination est obligatoire"),
  agencyId: z.string().min(1, "L'agence est obligatoire"),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  category: z.string().min(1, "La catégorie est obligatoire"),
  type: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema> & {
  type?: string;
};

// Utiliser les vraies agences du système
export { mockAgencies };

export const mockCategories = [
  { id: "1", name: "Virement", color: "bg-blue-500", icon: "arrow-right" },
  { id: "2", name: "Change", color: "bg-green-500", icon: "exchange" },
  { id: "3", name: "Transfert", color: "bg-purple-500", icon: "send" },
];
