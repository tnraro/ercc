import type { Character } from "$lib/characters";
import { calcCritical, calcDamage } from "$lib/damage";
import type { ItemData } from "$lib/items";
import { weaponTypeInfo } from "$lib/weaponTypeInfo";
import type { ItemFilterKey } from "./item-filter.svelte";

interface Data {
  character: Character;
  characterLevel: number;
  weapon: ItemData;
  weaponLevel: number;
  targetDefense: number;
  weaponType: string;
  weaponData: Record<string, number>;
  itemsBy: Record<Lowercase<ItemFilterKey>, ItemData[]>;
}
onmessage = (e: MessageEvent<Data>) => {
  const {
    character,
    characterLevel,
    weapon,
    weaponLevel,
    targetDefense,
    weaponType,
    weaponData,
    itemsBy,
  } = e.data;

  const atk0 =
    character.atk +
    character.atkLv * characterLevel +
    (weapon.atk + weapon.atkLv * characterLevel) -
    character.atkLv;
  const as0 =
    character.as +
    character.asLv * characterLevel +
    weaponTypeInfo.get(weaponType)!.as;
  const asr0 =
    weapon.asr + weapon.asrLv * characterLevel + weaponData.asr * weaponLevel;
  const adm0 = weaponData.adm * weaponLevel;
  const cc0 = character.cc + character.ccLv * characterLevel + weapon.cc;
  const cd0 = weapon.cd;
  const pd0 = weapon.pd;
  const pdr0 = weapon.pdr;

  const result = [];
  for (const chest of itemsBy.chest) {
    const atk1 = atk0 + (chest.atk + chest.atkLv * characterLevel);
    const asr1 = asr0 + (chest.asr + chest.asrLv * characterLevel);
    const cc1 = cc0 + chest.cc;
    const cd1 = cd0 + chest.cd;
    const pd1 = pd0 + chest.pd;
    const pdr1 = pdr0 + chest.pdr;
    for (const head of itemsBy.head) {
      const atk2 = atk1 + (head.atk + head.atkLv * characterLevel);
      const asr2 = asr1 + (head.asr + head.asrLv * characterLevel);
      const cc2 = cc1 + head.cc;
      const cd2 = cd1 + head.cd;
      const pd2 = pd1 + head.pd;
      const pdr2 = pdr1 + head.pdr;
      for (const arm of itemsBy.arm) {
        const atk3 = atk2 + (arm.atk + arm.atkLv * characterLevel);
        const asr3 = asr2 + (arm.asr + arm.asrLv * characterLevel);
        const cc3 = cc2 + arm.cc;
        const cd3 = cd2 + arm.cd;
        const pd3 = pd2 + arm.pd;
        const pdr3 = pdr2 + arm.pdr;
        for (const leg of itemsBy.leg) {
          const atk = atk3 + (leg.atk + leg.atkLv * characterLevel);
          const asr = asr3 + (leg.asr + leg.asrLv * characterLevel);
          const as = Math.max(
            Math.min(as0 * (1 + asr), character.asl),
            character.asm,
          );
          const adm = adm0;
          const cc = cc3 + leg.cc;
          const cd = cd3 + leg.cd;
          const pd = pd3 + leg.pd;
          const pdr = pdr3 + leg.pdr;
          const critical = calcCritical((atk * (1 + adm)) | 0, cc, cd);
          const damage = calcDamage(critical, pd, pdr, targetDefense);
          result.push({
            equipments: [weapon.id, chest.id, head.id, arm.id, leg.id],
            dps: damage * as,
            atk,
            asr,
            adm,
            as,
            cc,
            cd,
            pd,
            pdr,
            critical,
            damage,
          });
        }
      }
    }
  }
  postMessage(result);
};
