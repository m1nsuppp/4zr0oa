'use client';

import type { JSX } from 'react';
import { useTShirtSide } from '../_hooks/use-t-shirt-side';

export function Menu(): JSX.Element {
  const [, setTShirtSide] = useTShirtSide();

  return (
    <div className="absolute left-5 top-5 flex gap-2">
      <button
        type="button"
        className="hover:font-bold"
        onClick={() => setTShirtSide('back')}
      >
        Back
      </button>
      <button
        type="button"
        className="hover:font-bold"
        onClick={() => setTShirtSide('front')}
      >
        Front
      </button>
    </div>
  );
}
