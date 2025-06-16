
import { useState, useEffect } from "react";
import { TransactionFormData } from "@/components/transactions/form/TransactionFormData";
import { useTransactionCalculation as useFeatureTransactionCalculation } from "@/features/transactions/hooks/useTransactionCalculation";

export function useTransactionCalculation(watchedValues: TransactionFormData) {
  return useFeatureTransactionCalculation(watchedValues);
}
