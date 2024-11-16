'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Creating a react-query client setup for the app
const createReactQueryClient = new QueryClient();

export function TanStackReactQueryProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <QueryClientProvider client={createReactQueryClient}>{children}</QueryClientProvider>;
}
