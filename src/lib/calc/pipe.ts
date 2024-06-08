import type { PlayerStateOptions } from "src/comps/PlayerState.svelte";
import { sw } from "../sw";
import { weaponTypeInfo } from "../weaponTypeInfo";

interface DamageContext {
  atk: number,
  atkLv: number,
  asr: number,
  asrLv: number,
  cc: number,
  cd: number,
  pd: number,
  pdr: number,
  upd: number,
  updr: number,
}
export type HitContext = ReturnType<typeof hit>;
type RequiredNonNullable<T> = { [P in keyof T]-?: NonNullable<T[P]>; }
export const hit = (playerState: PlayerStateOptions, context: DamageContext) => {
  const { character, characterLevel, targetDefense, weaponLevel, weaponType } = playerState as RequiredNonNullable<PlayerStateOptions>;

  const weaponData = sw.find(
    ({ id, weaponType }) => id === character.id && weaponType === weaponType
  )!.stats;
  console.log(context.atk, context.atkLv, context.atk + context.atkLv * characterLevel);
  console.log(character);

  const meta = {
    atk: 0,
    as: 0,
    asr: 0,
    adm: 0,
    cc: 0,
    cd: 1.60,
    pd: 0,
    pdr: 0,
    upd: 0,
    updr: 0,
    characterId: character.id,
    characterLevel,
    weaponLevel,
    targetDefense,
  };
  // prepare
  meta.as += weaponTypeInfo.get(weaponType)?.as ?? 0;
  meta.asr += (weaponData.asr ?? 0) * weaponLevel;
  meta.adm += (weaponData.adm ?? 0) * weaponLevel;

  // apply character
  meta.as += character.as + character.asLv * characterLevel;
  meta.atk += int(character.atk + character.atkLv * (characterLevel - 1));
  console.log("atk", meta.atk);
  meta.cc += character.cc + character.ccLv * characterLevel;

  // apply context
  meta.asr += context.asr + context.asrLv * characterLevel;
  meta.atk += int(context.atk + context.atkLv * characterLevel);
  console.log("atk", meta.atk);
  meta.cc += context.cc;
  meta.cd += context.cd;
  meta.pd += context.pd;
  meta.pdr += context.pdr;
  meta.upd += context.upd;
  meta.updr += context.updr;

  const as = limit(meta.as * (1 + meta.asr), character.asm, character.asl);
  meta.cc = limit(meta.cc, 0, 1);

  const pd = Math.max(meta.pd, meta.upd);
  const pdr = Math.max(meta.pdr, meta.updr);

  let defense = targetDefense;
  defense = applyPdToDefense(defense, pd, pdr);

  let damage = int(meta.atk * (1 + meta.adm));
  damage = applyCriticalToDamage(damage, meta.cc, meta.cd);
  damage = applyDefenseToDamage(damage, defense);

  const dps = damage * as;

  return {
    dps,
    damage,
    as,
    meta,
  }
}

const applyDefenseToDamage = (damage: number, defense: number) =>
  int(damage * 100 / (100 + defense));
const applyCriticalToDamage = (damage: number, cc = 0, cd = 0): number =>
  int(damage * (1 - cc) + damage * cc * cd);
const applyPdToDefense = (defense: number, pd: number, pdr: number) =>
  Math.max(0, defense * (1 - pdr) - pd);
const limit = (x: number, a: number, b: number) => Math.max(Math.min(x, b), a);
const int = (x: number) => Math.trunc(x);

// Math.floor(atk * 100 / Math.max(100, 100 + def * (1 - pdr) - pd));

// atk * 100 / 100 + max(0, def * (1 - pdr) - pd) | 0
// 