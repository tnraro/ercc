export const calcDamage = (atk: number, adm: number, pd = 0, pdr = 0, def = 150) => {
  return Math.floor((atk + Math.floor(atk * adm)) * 100 / Math.max(100, 100 + def * (1 - pdr) - pd));
}