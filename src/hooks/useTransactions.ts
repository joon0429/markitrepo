import { getUserPurchases, getUserSales } from '@services/firebase/transactionService';
import { Transaction } from '@types';
import { useAsyncData } from './useAsyncData';

export function useTransactions(userId: string, type: 'purchases' | 'sales') {
  const fetcher = userId
    ? () => (type === 'purchases' ? getUserPurchases(userId) : getUserSales(userId))
    : null;

  const { data: transactions, loading, error, refresh } = useAsyncData<Transaction[]>(
    fetcher,
    [],
    [userId, type],
    'failed to load transactions'
  );

  return { transactions, loading, error, refresh };
}
