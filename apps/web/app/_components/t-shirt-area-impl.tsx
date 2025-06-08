'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import type { JSX } from 'react';
import { Layer, Stage, Image } from 'react-konva';
import { loadImage } from '../../lib/load-image';
import { useTShirtSide } from '../_hooks/use-t-shirt-side';
import type { TShirtSide } from '../../models/t-shirt.model';

function updateCursor(action: 'over' | 'out'): void {
  document.body.style.cursor = action === 'over' ? 'pointer' : 'default';
}

const T_SHIRT_IMAGE_PATHS: Readonly<Record<TShirtSide, string>> = {
  front: '/crew-front.png',
  back: '/crew-back.png',
};

export function TShirtAreaImpl(): JSX.Element {
  const [tShirtSide] = useTShirtSide();

  const { data: image } = useSuspenseQuery({
    queryKey: ['t-shirt', tShirtSide],
    queryFn: async () => await loadImage(T_SHIRT_IMAGE_PATHS[tShirtSide]),
    staleTime: Infinity,
  });

  const { innerWidth: stageWidth, innerHeight: stageHeight } = window;

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
    >
      <Layer>
        <Image
          image={image}
          x={stageWidth / 2 - image.width / 2}
          y={stageHeight / 2 - image.height / 2}
          width={image.width}
          height={image.height}
          draggable
          onPointerOver={() => {
            updateCursor('over');
          }}
          onPointerOut={() => {
            updateCursor('out');
          }}
        />
      </Layer>
    </Stage>
  );
}
