import { useState, useEffect, useCallback, DependencyList } from 'react';

interface AsyncDataResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// generic hook for async data fetching with loading/error/refresh pattern
// pass null as fetcher to skip fetching (e.g. when deps aren't ready)
export function useAsyncData<T>(
  fetcher: (() => Promise<T>) | null,
  initialValue: T,
  deps: DependencyList,
  errorMessage = 'failed to load data'
): AsyncDataResult<T> {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!fetcher) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err: any) {
      setError(err.message || errorMessage);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}
