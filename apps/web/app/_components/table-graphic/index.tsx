'use client';

import type { JSX } from 'react';
import { motion, type Transition as MotionTransition } from 'motion/react';
import { computeTabletopCoords } from './compute-tabletop-coords';
import { computeLegsCoords } from './compute-legs-coords';
import type { Coords } from './coords.model';
import { toPointsString } from './to-points-string';
import {
  TABLE_GRAPHIC_COLORS_DEFAULTS,
  type TableGraphicColors,
} from './table-graphic-colors.model';

function computeBounds({ p1, p2, p3, p4 }: Coords): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  const xs = [p1.x, p2.x, p3.x, p4.x];
  const ys = [p1.y, p2.y, p3.y, p4.y];

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

const VIEW_BOX_WIDTH = 300;
const VIEW_BOX_HEIGHT = 330;
const AVERAGE_DIVISOR = 2; // used to compute midpoints (e.g., (min+max)/2)
const VIEW_BOX_CENTER_X = VIEW_BOX_WIDTH / AVERAGE_DIVISOR;
const VIEW_BOX_CENTER_Y = VIEW_BOX_HEIGHT / AVERAGE_DIVISOR;

function computeCenterTranslate(widthMeters: number): { tx: number; ty: number } {
  const coords = computeTabletopCoords(widthMeters);
  const { minX, maxX, minY, maxY } = computeBounds(coords);
  const polyCenterX = (minX + maxX) / AVERAGE_DIVISOR;
  const polyCenterY = (minY + maxY) / AVERAGE_DIVISOR;

  return { tx: VIEW_BOX_CENTER_X - polyCenterX, ty: VIEW_BOX_CENTER_Y - polyCenterY };
}

const SIDE_THICKNESS = 15; // px vertical thickness for side faces

const TABLE_MOTION_TRANSITION: MotionTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 35,
  fill: { duration: 0.35, ease: 'easeInOut' },
};

export function TableGraphic({
  width,
  useMountAnimation = true,
  colors = TABLE_GRAPHIC_COLORS_DEFAULTS,
}: {
  width: number;
  useMountAnimation?: boolean;
  colors?: TableGraphicColors;
}): JSX.Element {
  const { tx, ty } = computeCenterTranslate(width);
  const tabletopCoords = computeTabletopCoords(width);

  return (
    <svg
      width={VIEW_BOX_WIDTH.toString()}
      height={VIEW_BOX_HEIGHT.toString()}
      viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
    >
      <motion.g
        initial={useMountAnimation}
        animate={{ x: tx, y: ty }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
      >
        {(() => {
          const {
            leftDark,
            leftLight,
            rightBackDark,
            rightBackLight,
            bottomFrontDark,
            bottomFrontLight,
          } = computeLegsCoords(tabletopCoords);

          return [
            { ...leftDark, fill: colors.contrasts.dark, key: 'left-dark' },
            { ...leftLight, fill: colors.contrasts.light, key: 'left-light' },
            { ...rightBackLight, fill: colors.contrasts.light, key: 'right-back-light' },
            { ...rightBackDark, fill: colors.contrasts.dark, key: 'right-back-dark' },
            { ...bottomFrontLight, fill: colors.contrasts.light, key: 'bottom-front-light' },
            { ...bottomFrontDark, fill: colors.contrasts.dark, key: 'bottom-front-dark' },
          ].map(({ fill, key, ...coords }) => (
            <motion.polygon
              key={key}
              name={key}
              animate={{ points: toPointsString(coords), fill }}
              initial={useMountAnimation ? { points: toPointsString(coords) } : false}
              transition={TABLE_MOTION_TRANSITION}
            />
          ));
        })()}

        <motion.polygon
          name="table-top"
          animate={{ points: toPointsString(tabletopCoords), fill: colors.baseColor }}
          initial={useMountAnimation ? { points: toPointsString(tabletopCoords) } : false}
          transition={TABLE_MOTION_TRANSITION}
          strokeWidth="2"
        />
        {(() => {
          const leftSide = toPointsString({
            p1: { x: tabletopCoords.p4.x, y: tabletopCoords.p4.y },
            p2: { x: tabletopCoords.p3.x, y: tabletopCoords.p3.y },
            p3: { x: tabletopCoords.p3.x, y: tabletopCoords.p3.y + SIDE_THICKNESS },
            p4: { x: tabletopCoords.p4.x, y: tabletopCoords.p4.y + SIDE_THICKNESS },
          });
          const rightSide = toPointsString({
            p1: { x: tabletopCoords.p2.x, y: tabletopCoords.p2.y },
            p2: { x: tabletopCoords.p3.x, y: tabletopCoords.p3.y },
            p3: { x: tabletopCoords.p3.x, y: tabletopCoords.p3.y + SIDE_THICKNESS },
            p4: { x: tabletopCoords.p2.x, y: tabletopCoords.p2.y + SIDE_THICKNESS },
          });

          return (
            <>
              <motion.polygon
                name="table-top-left-side"
                animate={{ points: leftSide, fill: colors.contrasts.dark }}
                initial={useMountAnimation ? { points: leftSide } : false}
                transition={TABLE_MOTION_TRANSITION}
              />
              <motion.polygon
                name="table-top-right-side"
                animate={{ points: rightSide, fill: colors.contrasts.light }}
                initial={useMountAnimation ? { points: rightSide } : false}
                transition={TABLE_MOTION_TRANSITION}
              />
            </>
          );
        })()}
      </motion.g>
    </svg>
  );
}
