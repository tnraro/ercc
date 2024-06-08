import { derived, readable, writable } from "svelte/store"
import { characters } from "./characters";
import { sw } from "./sw";
import { type ItemData, items } from "./items";

export const createErPreference = () => {
  const characterId = writable<number | undefined>();
  const character = derived(characterId, ($characterId) => {
    if ($characterId == null) return undefined;
    return characters.find(character => character.id === $characterId);
  });
  const weaponTypes = derived(characterId, ($characterId) => {
    return sw.filter(({ id }) => id === $characterId)
      .map(({ weaponType }) => weaponType);
  });
  const weaponType = derived(weaponTypes, ($weaponTypes) => {
    return $weaponTypes[0];
  });
  const weapons = derived(weaponType, ($weaponType) => {
    const weapons = items.filter((item) => item.type === $weaponType);
    return weapons;
  });
  const _weapon = writable<ItemData[] | undefined>();
}