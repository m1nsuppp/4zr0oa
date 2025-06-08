import type { JSX } from 'react';
import { TShirtAreaLoader } from './_components/t-shirt-area-loader';

export default function Page(): JSX.Element {
  return (
    <div className="w-full h-full">
      <TShirtAreaLoader />
    </div>
  );
}
