import type { Coords } from './coords.model';

function clamp(v: number, min: number, max: number): number {
  if (v < min) {
    return min;
  }

  if (v > max) {
    return max;
  }

  return v;
}

const CLAMP_MIN = 0.8;
const CLAMP_MAX = 1.8;
// Fixed points
const P1_Y = 33.33;
const P2_Y0 = 100; // at r0=0.8m
const P3_Y0 = 166.67; // at r0=0.8m
const R0 = 0.8; // meters (baseline)
// For 0.8m -> 1.8m, Δy and Δr anchors
const DELTA_Y_0800_TO_1800 = 50; // px
const DELTA_R_0800_TO_1800 = 1.0; // meters (0.8m -> 1.8m)
// slope per meter (vertical mode):
const BASE_SLOPE_PER_M = DELTA_Y_0800_TO_1800 / DELTA_R_0800_TO_1800; // = 50 px/m
const SLOPE_GAIN = 1.3; // tuning: >1 to exaggerate perspective, <1 to reduce
const SLOPE_PER_M = BASE_SLOPE_PER_M * SLOPE_GAIN;
// horizontal component (diagonal parallel translation)
const X2_X0 = 200; // baseline x for P2 at r0
const X3_X0 = 100; // baseline x for P3 at r0
const BASE_DX_PER_M = 100; // px/m baseline for x shift
const DX_GAIN = 1.0; // tuning gain for x
const DX_PER_M = BASE_DX_PER_M * DX_GAIN;

export function computeTabletopCoords(widthMeters: number): Coords {
  const r = clamp(widthMeters, CLAMP_MIN, CLAMP_MAX);
  const dy = (r - R0) * SLOPE_PER_M;
  const dx = (r - R0) * DX_PER_M;

  const p1 = { x: 100, y: P1_Y };
  const p2 = { x: X2_X0 + dx, y: P2_Y0 + dy };
  const p3 = { x: X3_X0 + dx, y: P3_Y0 + dy };
  const p4 = { x: 0, y: 100 };

  return { p1, p2, p3, p4 };
}
