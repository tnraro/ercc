import * as Bun from "bun";
import path from "node:path";

const API_KEY = process.env.API_KEY;

if (API_KEY == null) {
  throw new Error("API_KEY is not set");
}

await genCharacters();
await genItems();
await genSw();
await genWeaponType();

async function genCharacters() {
  const characterData = await fetchData("Character");
  const characterLvUpStatData = await fetchData("CharacterLevelUpStat");

  const characters = characterData.map((x) => ({
    id: x.code,
    name: x.name,
    atk: x.attackPower,
    atkLv: 0,
    as: x.attackSpeed,
    asl: x.attackSpeedLimit,
    asm: x.attackSpeedMin,
    asLv: 0,
    cc: x.criticalStrikeChance,
    ccLv: 0,
  }));

  characterLvUpStatData.forEach((x) => {
    const character = characters.find((y) => y.id === x.code);
    if (character == null) return;
    character.atkLv = x.attackPower;
    character.asLv = x.attackSpeed;
    character.ccLv = x.criticalChance;
  });

  await write(
    "characters.ts",
    `export type Character = typeof characters[0];
export const characters = ${JSON.stringify(characters, null, 2)};

const indexedById = new Map(characters.map((x) => [x.id, x]));

export function findCharacterById(id: number) {
  return indexedById.get(id);
}`,
  );
}
async function genItems() {
  const weapons = await fetchData("ItemWeapon");
  const armors = await fetchData("ItemArmor");

  const items = [
    ...weapons.filter((x) => x.isCompletedItem).map(itemToStats),
    ...armors.filter((x) => x.isCompletedItem).map(itemToStats),
  ].filter((x) => x.modeType === 0 || (x.modeType & 0b111) !== 0);

  await write(
    "items.ts",
    `export type ItemGrade = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
export const weaponTypes = [
  "OneHandSword",
  "TwoHandSword",
  "DualSword",
  "Hammer",
  "Axe",
  "Spear",
  "Bat",
  "Whip",
  "Glove",
  "Tonfa",
  "HighAngleFire",
  "DirectFire",
  "Bow",
  "CrossBow",
  "Pistol",
  "AssaultRifle",
  "SniperRifle",
  "Nunchaku",
  "Rapier",
  "Guitar",
  "Camera",
  "Arcana",
  "VFArm",
];
export type ItemType =
  | "OneHandSword"
  | "TwoHandSword"
  | "DualSword"
  | "Hammer"
  | "Axe"
  | "Spear"
  | "Bat"
  | "Whip"
  | "Glove"
  | "Tonfa"
  | "HighAngleFire"
  | "DirectFire"
  | "Bow"
  | "CrossBow"
  | "Pistol"
  | "AssaultRifle"
  | "SniperRifle"
  | "Nunchaku"
  | "Rapier"
  | "Guitar"
  | "Camera"
  | "Arcana"
  | "VFArm"
  | "Head"
  | "Chest"
  | "Arm"
  | "Leg"
  | "Trinket";
export interface ItemData {
  id: number;
  name: string;
  type: ItemType;
  modeType: number;
  grade: ItemGrade;
  atk: number;
  atkLv: number;
  asr: number;
  asrLv: number;
  cc: number;
  cd: number;
  pd: number;
  pdr: number;
  upd: number;
  updr: number;
}
export const items: ItemData[] = ${JSON.stringify(items, null, 2)};

const indexedById = new Map(items.map((item) => [item.id, item]));

export function findItemById(id: number) {
  return indexedById.get(id);
}
export function findItemByType(type: ItemType): ItemData[] {
  return items.filter((item) => item.type === type);
}`,
  );

  function itemGrade(grade) {
    switch (grade) {
      case "Legend":
        return "legendary";
      default:
        return grade.toLowerCase();
    }
  }
  function itemToStats(x) {
    return {
      id: parseInt(x.code),
      name: x.name,
      type: x.weaponType ?? x.armorType,
      modeType: x.modeType,
      grade: itemGrade(x.itemGrade),
      atk: x.attackPower + x.adaptiveForce,
      atkLv: x.attackPowerByLv + x.adaptiveForceByLevel,
      asr: x.attackSpeedRatio,
      asrLv: x.attackSpeedRatioByLv,
      cc: x.criticalStrikeChance,
      cd: x.criticalStrikeDamage,
      pd: x.penetrationDefense,
      pdr: x.penetrationDefenseRatio,
      upd: x.uniquePenetrationDefense,
      updr: x.uniquePenetrationDefenseRatio,
    };
  }
}

async function genSw() {
  const sw = await fetchData("CharacterAttributes");
  const ms = await fetchData("MasteryStat");

  await write(
    "sw.ts",
    `export const sw: { index: number, id: number, weaponType: string, stats: Record<string, number> }[] = ${JSON.stringify(
      sw.map((x, i) => ({
        index: i + 1,
        id: x.characterCode,
        weaponType: x.mastery,
        stats: processSwOptions(findMs(x)),
      })),
      null,
      2,
    )};`,
  );
  function findMs(x) {
    return ms.find(
      (y) => y.characterCode === x.characterCode && y.type === x.mastery,
    );
  }
  function processSwOptions(x) {
    const short = {
      AttackSpeedRatio: "asr",
      IncreaseBasicAttackDamageRatio: "adm", // attack damage multiplier
      // "SkillAmpRatio"
      AttackPower: "atk",
      // "AmplifierToMonsterRatio"
      // "HpRegenRatioOutOfCombat"
      // "SpRegenRatioOutOfCombat"
      // "MoveSpeed"
      // "PreventBasicAttackDamagedRatio"
      // "PreventSkillDamagedRatio"
    };
    return {
      ...options("first"),
      ...options("second"),
      ...options("third"),
    };
    function options(id) {
      const prop = x[`${id}Option`];
      const value = x[`${id}OptionSection3Value`]; // 스쿼드겠지....
      if (short[prop] != null) {
        return {
          [short[prop]]: value,
        };
      }
      return {};
    }
  }
}

async function genWeaponType() {
  const weaponTypeInfo = await fetchData("WeaponTypeInfo");

  const weaponTypes = weaponTypeInfo.map((x) => {
    return {
      type: x.type,
      as: x.attackSpeed,
    };
  });

  write(
    "weaponTypeInfo.ts",
    `export const weaponTypeInfo = new Map<string, { type: string, as: number }>([
${weaponTypes.map((wt) => `  ["${wt.type}", ${JSON.stringify(wt)}]`).join(",\n")}
]);`,
  );
}

async function write(name, data) {
  const __dirname = new URL(import.meta.url).pathname;
  await Bun.write(path.join(__dirname, "../../src/lib/", name), data);
}
async function fetchData(path, version = "v2") {
  const res = await fetch(`https://open-api.bser.io/${version}/data/${path}`, {
    headers: {
      accept: "application/json",
      "x-api-key": API_KEY,
    },
  });
  if (res.status < 200 || res.status >= 300) {
    throw new Error(res.statusText);
  }
  const body = await res.json();
  if (body.code < 200 || body.code >= 300) {
    throw new Error(body.message);
  }
  return body.data;
}
