export function calcCritical(atk: number, cc = 0, cd = 0, cdb = 1.6): number {
  const _cc = Math.max(Math.min(cc, 1), 0);
  return Math.floor(atk * (1 - _cc) + atk * _cc * (cdb + cd));
}

export function calcDamage(atk: number, pd = 0, pdr = 0, def = 150) {
  return Math.floor((atk * 100) / Math.max(100, 100 + def * (1 - pdr) - pd));
}
