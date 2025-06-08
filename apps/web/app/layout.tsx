import './_styles/globals.css';
import type { Metadata } from 'next';
import type { JSX, ReactNode } from 'react';
import { AppQueryClientProvider } from './_contexts/app-query-client.context';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export const metadata: Metadata = {
  title: 'T-shirt Designer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <html lang="ko">
      <body>
        <NuqsAdapter>
          <AppQueryClientProvider>{children}</AppQueryClientProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
