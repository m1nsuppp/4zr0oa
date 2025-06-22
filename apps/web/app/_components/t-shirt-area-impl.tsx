'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState, type JSX } from 'react';
import { Layer, Stage, Image, Rect, Group, Transformer } from 'react-konva';
import { loadImage } from '../../lib/load-image';
import { useTShirtSide } from '../_hooks/use-t-shirt-side';
import type { TShirtSide } from '../../models/t-shirt.model';
import Konva from 'konva';

const T_SHIRT_IMAGE_PATHS: Readonly<Record<TShirtSide, string>> = {
  front: '/crew-front.png',
  back: '/crew-back.png',
};

const USER_CONTENT_GROUP_ID = 'userContentGroup';

const degToRad = (angle: number): number => (angle / 180) * Math.PI;

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

  const [userContentRect, setUserContentRect] = useState<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    fill: string;
  }>({
    id: 'userContentRect',
    width: 100,
    height: 100,
    x: DESIGN_AREA_DIMENSIONS.front.width / 2 - 100 / 2,
    y: DESIGN_AREA_DIMENSIONS.front.height / 2 - 100 / 2,
    rotation: 0,
    fill: 'orange',
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionRect, setSelectionRect] = useState<{
    visible: boolean;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }>({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  type NodeId = string;
  const nodeRefs = useRef<Map<NodeId, Konva.Rect>>(new Map());
  const isSelecting = useRef<boolean>(false);

  const [tShirtSide] = useTShirtSide();
  const { data: image } = useSuspenseQuery({
    queryKey: ['t-shirt', tShirtSide],
    queryFn: async () => await loadImage(T_SHIRT_IMAGE_PATHS[tShirtSide]),
    staleTime: Infinity,
  });

  const { userContentGroupOriginX, userContentGroupOriginY } = useMemo(() => {
    const userContentGroupOriginX = stageWidth / 2 - DESIGN_AREA_DIMENSIONS[tShirtSide].width / 2;
    const userContentGroupOriginY = stageHeight / 2 - DESIGN_AREA_DIMENSIONS[tShirtSide].height / 2;

    return { userContentGroupOriginX, userContentGroupOriginY };
  }, [stageWidth, stageHeight, tShirtSide]);

  useEffect(() => {
    if (selectedIds.length > 0 && transformerRef.current !== null && imageRef.current !== null) {
      transformerRef.current.nodes(
        selectedIds.map((id) => nodeRefs.current.get(id)).filter((node) => node !== undefined),
      );
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

        const selectionBox = {
          x: Math.min(selectionRect.x1, selectionRect.x2),
          y: Math.min(selectionRect.y1, selectionRect.y2),
          width: Math.abs(selectionRect.x2 - selectionRect.x1),
          height: Math.abs(selectionRect.y2 - selectionRect.y1),
        };

        const absoluteUserContentRect = {
          ...userContentRect,
          x: userContentRect.x + userContentGroupOriginX,
          y: userContentRect.y + userContentGroupOriginY,
        };

        const isSelected = Konva.Util.haveIntersection(
          selectionBox,
          getClientRect(absoluteUserContentRect),
        );

        if (isSelected) {
          setSelectedIds([userContentRect.id]);
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
          listening={false}
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
            x={userContentGroupOriginX}
            y={userContentGroupOriginY}
            width={DESIGN_AREA_DIMENSIONS[tShirtSide].width}
            height={DESIGN_AREA_DIMENSIONS[tShirtSide].height}
            stroke="black"
            strokeWidth={2}
            listening={false}
          />

          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.rect(
                userContentGroupOriginX,
                userContentGroupOriginY,
                DESIGN_AREA_DIMENSIONS[tShirtSide].width,
                DESIGN_AREA_DIMENSIONS[tShirtSide].height,
              );
              ctx.closePath();
            }}
          >
            <Group
              id={USER_CONTENT_GROUP_ID}
              x={userContentGroupOriginX}
              y={userContentGroupOriginY}
            >
              <Rect
                id={userContentRect.id}
                ref={(node) => {
                  if (node !== null) {
                    nodeRefs.current.set(node.id(), node);
                  }
                }}
                draggable
                x={userContentRect.x}
                y={userContentRect.y}
                width={userContentRect.width}
                height={userContentRect.height}
                rotation={userContentRect.rotation}
                fill={userContentRect.fill}
                onDragStart={() => {
                  setSelectedIds([userContentRect.id]);
                }}
                onDragEnd={(e) => {
                  setUserContentRect((prev) => ({
                    ...prev,
                    x: e.target.x(),
                    y: e.target.y(),
                  }));
                }}
                onTransformEnd={(e) => {
                  const scaleX = e.target.scaleX();
                  const scaleY = e.target.scaleY();

                  e.target.scaleX(1);
                  e.target.scaleY(1);

                  setUserContentRect((prev) => ({
                    ...prev,
                    x: e.target.x(),
                    y: e.target.y(),
                    width: Math.max(5, e.target.width() * scaleX),
                    height: Math.max(5, e.target.height() * scaleY),
                    rotation: e.target.rotation(),
                  }));
                }}
              />
            </Group>
          </Group>
        </Group>

        <Transformer
          ref={(node) => {
            if (node !== null) {
              transformerRef.current = node;
            }
          }}
        />

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
