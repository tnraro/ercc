export function clampCc(cc = 0) {
  return Math.max(Math.min(cc, 1), 0);
}

export function clampAs(as: number, asl: number, asm: number) {
  return Math.max(Math.min(as, asl), asm);
}

export function calcCritical(atk: number, cc = 0, cd = 0, cdb = 1.6): number {
  return Math.floor(atk * (1 - cc) + atk * cc * (cdb + cd));
}

export function calcDamage(atk: number, pd = 0, pdr = 0, def = 150) {
  return Math.floor((atk * 100) / Math.max(100, 100 + def * (1 - pdr) - pd));
}
