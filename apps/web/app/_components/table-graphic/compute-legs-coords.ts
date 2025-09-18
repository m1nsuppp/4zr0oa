import type { Coords } from './coords.model';

const SIDE_THICKNESS = 15; // px vertical thickness for side faces

// Leg geometry semantic offsets (px)
const LEG_X_OFFSET_SMALL = 8; // narrow x offset for leg faces
const LEG_X_OFFSET_MED = 14; // wider x offset for leg faces
const LEG_Y_TOP_OFFSET = 5; // small y offset below underside
const LEG_Y_TOP_OFFSET_LIGHT = 2; // lighter face slight y offset
const LEG_Y_LENGTH_LONG = 75; // leg length (long side)
const LEG_Y_LENGTH_SHORT = 70; // leg length (short side)
const LEG_Y_LENGTH_LIGHT = 72; // leg length for lighter face

// Bottom leg vertical deltas
const LEG_BOTTOM_Y_DELTA1 = 3.33; // top slant delta
const LEG_BOTTOM_Y_LENGTH = 63.33; // main vertical run
const LEG_BOTTOM_Y_END = 65.33; // bottom end y delta

export function computeLegsCoords(coords: Omit<Coords, 'p1'>): {
  leftDark: Coords;
  leftLight: Coords;
  rightBackDark: Coords;
  rightBackLight: Coords;
  bottomFrontDark: Coords;
  bottomFrontLight: Coords;
} {
  const { p2, p3, p4 } = coords;

  // Left leg at left vertex p4, underside offset by SIDE_THICKNESS
  const leftDark = {
    p1: { x: p4.x, y: p4.y + SIDE_THICKNESS },
    p2: { x: p4.x + LEG_X_OFFSET_SMALL, y: p4.y + SIDE_THICKNESS + LEG_Y_TOP_OFFSET },
    p3: { x: p4.x + LEG_X_OFFSET_SMALL, y: p4.y + SIDE_THICKNESS + LEG_Y_LENGTH_LONG },
    p4: { x: p4.x, y: p4.y + SIDE_THICKNESS + LEG_Y_LENGTH_SHORT },
  };
  const leftLight = {
    p1: { x: p4.x + LEG_X_OFFSET_SMALL, y: p4.y + SIDE_THICKNESS + LEG_Y_TOP_OFFSET },
    p2: { x: p4.x + LEG_X_OFFSET_MED, y: p4.y + SIDE_THICKNESS + LEG_Y_TOP_OFFSET_LIGHT },
    p3: { x: p4.x + LEG_X_OFFSET_MED, y: p4.y + SIDE_THICKNESS + LEG_Y_LENGTH_LIGHT },
    p4: { x: p4.x + LEG_X_OFFSET_SMALL, y: p4.y + SIDE_THICKNESS + LEG_Y_LENGTH_LONG },
  };

  // Right leg at right vertex p2
  const rightBackLight = {
    p1: { x: p2.x, y: p2.y + SIDE_THICKNESS },
    p2: { x: p2.x - LEG_X_OFFSET_SMALL, y: p2.y + SIDE_THICKNESS + LEG_Y_TOP_OFFSET },
    p3: { x: p2.x - LEG_X_OFFSET_SMALL, y: p2.y + SIDE_THICKNESS + LEG_Y_LENGTH_LONG },
    p4: { x: p2.x, y: p2.y + SIDE_THICKNESS + LEG_Y_LENGTH_SHORT },
  };
  const rightBackDark = {
    p1: { x: p2.x - LEG_X_OFFSET_SMALL, y: p2.y + SIDE_THICKNESS + LEG_Y_TOP_OFFSET },
    p2: { x: p2.x - LEG_X_OFFSET_MED, y: p2.y + SIDE_THICKNESS + LEG_Y_TOP_OFFSET_LIGHT },
    p3: { x: p2.x - LEG_X_OFFSET_MED, y: p2.y + SIDE_THICKNESS + LEG_Y_LENGTH_LIGHT },
    p4: { x: p2.x - LEG_X_OFFSET_SMALL, y: p2.y + SIDE_THICKNESS + LEG_Y_LENGTH_LONG },
  };

  // Bottom leg at bottom vertex p3
  const bottomFrontLight = {
    p1: { x: p3.x, y: p3.y },
    p2: { x: p3.x + LEG_X_OFFSET_SMALL, y: p3.y + LEG_BOTTOM_Y_DELTA1 },
    p3: { x: p3.x + LEG_X_OFFSET_SMALL, y: p3.y + LEG_BOTTOM_Y_LENGTH },
    p4: { x: p3.x, y: p3.y + LEG_BOTTOM_Y_END },
  };
  const bottomFrontDark = {
    p1: { x: p3.x, y: p3.y },
    p2: { x: p3.x - LEG_X_OFFSET_SMALL, y: p3.y + LEG_BOTTOM_Y_DELTA1 },
    p3: { x: p3.x - LEG_X_OFFSET_SMALL, y: p3.y + LEG_BOTTOM_Y_LENGTH },
    p4: { x: p3.x, y: p3.y + LEG_BOTTOM_Y_END },
  };

  return {
    leftDark,
    leftLight,
    rightBackDark,
    rightBackLight,
    bottomFrontDark,
    bottomFrontLight,
  };
}
