import type { Coords } from './coords.model';

const PRECISION_DIGITS = 2;
function fmt2(n: number): string {
  return n.toFixed(PRECISION_DIGITS);
}

export function toPointsString({ p1, p2, p3, p4 }: Coords): string {
  return `${fmt2(p1.x)},${fmt2(p1.y)} ${fmt2(p2.x)},${fmt2(p2.y)} ${fmt2(p3.x)},${fmt2(p3.y)} ${fmt2(p4.x)},${fmt2(p4.y)}`;
}
