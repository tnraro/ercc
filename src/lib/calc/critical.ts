export const calcCritical = (atk: number, cc = 0, cd = 0, cdb = 1.60): number => {
  const _cc = Math.max(Math.min(cc, 1), 0);
  return Math.floor(atk * (1 - _cc) + atk * _cc * (cdb + cd));
}