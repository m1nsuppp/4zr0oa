'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState, type JSX } from 'react';
import { Layer, Stage, Image, Rect, Group, Text } from 'react-konva';
import { loadImage } from '../../lib/load-image';
import { useTShirtSide } from '../_hooks/use-t-shirt-side';
import type { TShirtSide } from '../../models/t-shirt.model';
import Konva from 'konva';

const T_SHIRT_IMAGE_PATHS: Readonly<Record<TShirtSide, string>> = {
  front: '/crew-front.png',
  back: '/crew-back.png',
};

function degToRad(angle: number): number {
  return (angle / 180) * Math.PI;
}

const getDistance = (diffX: number, diffY: number): number =>
  Math.sqrt(diffX * diffX + diffY * diffY);

// eslint-disable-next-line @typescript-eslint/max-params -- TODO: Refactor
function getCorner(
  pivotX: number,
  pivotY: number,
  diffX: number,
  diffY: number,
  angle: number,
): { x: number; y: number } {
  const distance = getDistance(diffX, diffY);
  angle += Math.atan2(diffY, diffX);
  const x = pivotX + distance * Math.cos(angle);
  const y = pivotY + distance * Math.sin(angle);

  return { x, y };
}

function getClientRect(rect: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}): { x: number; y: number; width: number; height: number } {
  const { x, y, width, height, rotation = 0 } = rect;
  const rad = degToRad(rotation);

  const p1 = getCorner(x, y, 0, 0, rad);
  const p2 = getCorner(x, y, width, 0, rad);
  const p3 = getCorner(x, y, width, height, rad);
  const p4 = getCorner(x, y, 0, height, rad);

  const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
  const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
  const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
  const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function createTShirtImageLayerNameBySide(side: TShirtSide): string {
  return `t-shirt-image-name-${side}`;
}

const DESIGN_AREA_DIMENSIONS = {
  front: {
    width: 200,
    height: 300,
  },
  back: {
    width: 100,
    height: 100,
  },
};

export function TShirtAreaImpl(): JSX.Element {
  const { innerWidth: stageWidth, innerHeight: stageHeight } = window;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionRect, setSelectionRect] = useState({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const isSelecting = useRef<boolean>(false);

  const [tShirtSide] = useTShirtSide();
  const { data: image } = useSuspenseQuery({
    queryKey: ['t-shirt', tShirtSide],
    queryFn: async () => await loadImage(T_SHIRT_IMAGE_PATHS[tShirtSide]),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (selectedIds.length > 0 && transformerRef.current !== null && imageRef.current !== null) {
      transformerRef.current.nodes([imageRef.current]);
    } else if (transformerRef.current !== null) {
      transformerRef.current.nodes([]);
    }
  }, [selectedIds]);

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      onClick={(e) => {
        if (selectionRect.visible) {
          return;
        }

        if (e.target === e.target.getStage()) {
          setSelectedIds([]);

          return;
        }

        if (!e.target.hasName(createTShirtImageLayerNameBySide(tShirtSide))) {
          return;
        }

        const clickedId = e.target.id();

        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = selectedIds.includes(clickedId);

        if (!metaPressed && !isSelected) {
          setSelectedIds([clickedId]);
        } else if (metaPressed && isSelected) {
          setSelectedIds((prev) => prev.filter((id) => id !== clickedId));
        } else if (metaPressed && !isSelected) {
          setSelectedIds((prev) => [...prev, clickedId]);
        }
      }}
      onMouseDown={(e) => {
        const stage = e.target.getStage();
        if (e.target !== stage) {
          return;
        }

        isSelecting.current = true;
        const pointerPosition = stage.getPointerPosition();
        if (pointerPosition === null) {
          return;
        }

        setSelectionRect({
          visible: true,
          x1: pointerPosition.x,
          y1: pointerPosition.y,
          x2: pointerPosition.x,
          y2: pointerPosition.y,
        });
      }}
      onMouseMove={(e) => {
        if (!isSelecting.current) {
          return;
        }

        const pointerPosition = e.target.getStage()?.getPointerPosition();
        if (pointerPosition == null) {
          return;
        }

        setSelectionRect({
          ...selectionRect,
          x2: pointerPosition.x,
          y2: pointerPosition.y,
        });
      }}
      onMouseUp={() => {
        if (!isSelecting.current) {
          return;
        }
        isSelecting.current = false;

        setTimeout(() => {
          setSelectionRect({
            ...selectionRect,
            visible: false,
          });
        });

        if (imageRef.current === null) {
          return;
        }

        const selectionBox = {
          x: Math.min(selectionRect.x1, selectionRect.x2),
          y: Math.min(selectionRect.y1, selectionRect.y2),
          width: Math.abs(selectionRect.x2 - selectionRect.x1),
          height: Math.abs(selectionRect.y2 - selectionRect.y1),
        };

        const isSelected = Konva.Util.haveIntersection(
          selectionBox,
          getClientRect({
            x: imageRef.current.x(),
            y: imageRef.current.y(),
            width: imageRef.current.width(),
            height: imageRef.current.height(),
            rotation: imageRef.current.rotation(),
          }),
        );

        if (isSelected) {
          setSelectedIds([imageRef.current.id()]);
        } else {
          setSelectedIds([]);
        }
      }}
    >
      <Layer>
        <Image
          ref={imageRef}
          image={image}
          x={stageWidth / 2 - image.width / 2}
          y={stageHeight / 2 - image.height / 2}
          width={image.width}
          height={image.height}
        />

        <Group
          clipFunc={(ctx) => {
            if (imageRef.current !== null) {
              ctx.beginPath();
              ctx.rect(
                imageRef.current.x(),
                imageRef.current.y(),
                imageRef.current.width(),
                imageRef.current.height(),
              );
              ctx.closePath();
            }
          }}
        >
          <Rect
            x={stageWidth / 2 - DESIGN_AREA_DIMENSIONS[tShirtSide].width / 2}
            y={stageHeight / 2 - DESIGN_AREA_DIMENSIONS[tShirtSide].height / 2}
            width={DESIGN_AREA_DIMENSIONS[tShirtSide].width}
            height={DESIGN_AREA_DIMENSIONS[tShirtSide].height}
            stroke="black"
            strokeWidth={2}
          />

          {/* 디자인 영역으로 클리핑된 그룹 */}
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.rect(
                stageWidth / 2 - DESIGN_AREA_DIMENSIONS[tShirtSide].width / 2,
                stageHeight / 2 - DESIGN_AREA_DIMENSIONS[tShirtSide].height / 2,
                DESIGN_AREA_DIMENSIONS[tShirtSide].width,
                DESIGN_AREA_DIMENSIONS[tShirtSide].height,
              );
              ctx.closePath();
            }}
          >
            {/* 사용자 콘텐츠 그룹 */}
            <Group
              id="userContentGroup"
              draggable
              x={stageWidth / 2 - DESIGN_AREA_DIMENSIONS[tShirtSide].width / 2 + 50}
              y={stageHeight / 2 - DESIGN_AREA_DIMENSIONS[tShirtSide].height / 2 + 50}
            >
              <Rect
                width={100}
                height={100}
                fill="orange"
              />
              <Text
                text="내 티셔츠"
                fontSize={20}
                fill="black"
                y={120}
                width={100}
                align="center"
              />
            </Group>
          </Group>
        </Group>

        {selectionRect.visible && (
          <Rect
            x={Math.min(selectionRect.x1, selectionRect.x2)}
            y={Math.min(selectionRect.y1, selectionRect.y2)}
            width={Math.abs(selectionRect.x2 - selectionRect.x1)}
            height={Math.abs(selectionRect.y2 - selectionRect.y1)}
            fill="rgba(0,0,255,0.5)"
          />
        )}
      </Layer>
    </Stage>
  );
}
