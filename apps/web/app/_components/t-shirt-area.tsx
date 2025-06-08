'use client';

import dynamic from 'next/dynamic';
import type { JSX } from 'react';

const TShirtAreaImpl = dynamic(async () => (await import('./t-shirt-area-impl')).TShirtAreaImpl, {
  ssr: false,
  loading: () => <p>loading...</p>,
});

export function TShirtArea(): JSX.Element {
  return <TShirtAreaImpl />;
}
