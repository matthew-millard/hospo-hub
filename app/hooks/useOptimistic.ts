import { useFetchers } from '@remix-run/react';

export function useOptimistic(fetcherKey: string, inputName: string) {
  const fetchers = useFetchers();
  const optimisticFetcher = fetchers.find(fetcher => fetcher.key === fetcherKey);
  const optimisticValue = optimisticFetcher?.formData?.get(inputName);

  if (optimisticValue) {
    return optimisticValue as string;
  } else {
    return null;
  }
}
