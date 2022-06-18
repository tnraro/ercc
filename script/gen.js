import fs from "fs/promises";
import path from "path";

const API_KEY = process.env.API_KEY;

if (API_KEY == null) {
  throw new Error("API_KEY is not set");
}

async function fetchData(path) {
  const res = await fetch("https://open-api.bser.io/v1/data/" + path, {
    headers: {
      accept: "application/json",
      "x-api-key": API_KEY
    }
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

async function write(name, data) {
  await fs.writeFile(path.join(new URL(import.meta.url).pathname, "../../src/lib/", name), data);
}

const characters = await fetchData("Character");
const characterLvUpStats = await fetchData("CharacterLevelUpStat");

const list = characters.map((x) => ({
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


characterLvUpStats.forEach(x => {
  const p = list.find(y => y.id === x.code);
  if (p == null) return;
  p.atkLv = x.attackPower;
  p.asLv = x.attackSpeed;
  p.ccLv = x.criticalChance;
});

await write("characters.ts", `export const characters = ${JSON.stringify(list, null, 2)};

const indexedById = new Map(characters.map((x) => [x.id, x]));

export function findCharacterById(id: number) {
  return indexedById.get(id);
}`);

// ---

const weapons = await fetchData("ItemWeapon");
const armors = await fetchData("ItemArmor");

const itemGrade = (grade) => {
  switch (grade) {
    case "Legend":
      return "legendary";
    default:
      return grade.toLowerCase();
  }
}

const items = [
  ...weapons.map((w) => ({
    id: w.code,
    name: w.name,
    type: w.weaponType,
    modeType: w.modeType,
    grade: itemGrade(w.itemGrade),
    atk: w.attackPower,
    atkLv: w.attackPowerByLv,
    asr: w.attackSpeedRatio,
    asrLv: w.attackSpeedRatioByLv,
    cc: w.criticalStrikeChance,
    cd: w.criticalStrikeDamage,
  })),
  ...armors.map((w) => ({
    id: w.code,
    name: w.name,
    type: w.armorType,
    modeType: w.modeType,
    grade: itemGrade(w.itemGrade),
    atk: w.attackPower,
    atkLv: w.attackPowerByLv,
    asr: w.attackSpeedRatio,
    asrLv: w.attackSpeedRatioByLv,
    cc: w.criticalStrikeChance,
    cd: w.criticalStrikeDamage,
  })),
];

await write("items.ts", `export type ItemGrade = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
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
}
export const items: ItemData[] = ${JSON.stringify(items, null, 2)};

const indexedById = new Map(items.map((item) => [item.id, item]));

export function findItemById(id: number) {
  return indexedById.get(id);
}
export function findItemByType(type: ItemType): ItemData[] {
  return items.filter((item) => item.type === type);
}`);

const criticalChance = await fetchData("CriticalChance");

const cc = criticalChance.map(x => [x.probability / 100, x.actualUse]);

write("actual-cc.ts", `export const actualUsedCriticalChance = new Map<number, number>(${JSON.stringify(cc, null, 2)});`);