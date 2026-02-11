import { useState, useEffect, useCallback } from 'react';
import { getUserPurchases, getUserSales } from '@services/firebase/transactionService';
import { Transaction } from '@types';

export function useTransactions(userId: string, type: 'purchases' | 'sales') {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const results =
        type === 'purchases'
          ? await getUserPurchases(userId)
          : await getUserSales(userId);

      setTransactions(results);
    } catch (err: any) {
      setError(err.message || 'failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [userId, type]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    refresh: fetchTransactions,
  };
}
