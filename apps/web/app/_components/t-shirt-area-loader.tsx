'use client';

import dynamic from 'next/dynamic';
import type { JSX } from 'react';

const TShirtArea = dynamic(async () => (await import('./t-shirt-area')).TShirtArea, {
  ssr: false,
  loading: () => <p>loading...</p>,
});

export function TShirtAreaLoader(): JSX.Element {
  return <TShirtArea />;
}
