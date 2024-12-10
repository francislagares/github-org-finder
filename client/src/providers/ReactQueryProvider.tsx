'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ms from 'ms';
import { PropsWithChildren, useState } from 'react';

const ReactQueryProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: ms('12h'),
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
