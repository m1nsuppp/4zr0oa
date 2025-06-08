import type { JSX } from 'react';
import { TShirtArea } from './_components/t-shirt-area';
import { Menu } from './_components/menu';

export default function Page(): JSX.Element {
  return (
    <div className="w-full h-full relative">
      <TShirtArea />
      <Menu />
    </div>
  );
}
