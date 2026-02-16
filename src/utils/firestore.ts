import {
  collection,
  query,
  where,
  getDocs,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@services/firebase/config';

// firestore 'in' queries are limited to 30 values
// this helper batches the query into groups of 30 and merges results
export async function batchInQuery<T>(
  collectionName: string,
  field: string,
  values: string[],
  additionalConstraints: QueryConstraint[] = []
): Promise<T[]> {
  if (values.length === 0) return [];

  const results: T[] = [];

  for (let i = 0; i < values.length; i += 30) {
    const batch = values.slice(i, i + 30);
    const q = query(
      collection(db, collectionName),
      where(field, 'in', batch),
      ...additionalConstraints
    );
    const snap = await getDocs(q);
    results.push(...snap.docs.map(d => d.data() as T));
  }

  return results;
}
