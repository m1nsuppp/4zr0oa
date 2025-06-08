'use client';

import { type ReactNode, type JSX, useState } from 'react';
import {
  QueryClient,
  QueryClientProvider as ReactQueryQueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function AppQueryClientProvider({ children }: { children: ReactNode }): JSX.Element {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ReactQueryQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </ReactQueryQueryClientProvider>
  );
}
