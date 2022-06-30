<script lang="ts">
  import { characters, findCharacterById } from "../lib/characters";
  import {
    findItemById,
    findItemByType,
    ItemGrade,
    ItemType,
    weaponTypes,
  } from "../lib/items";
  import { sw } from "../lib/sw";

  import Item from "./Item.svelte";

  export let lv: number;
  export let atk: number;
  export let cc: number;
  export let cd: number;
  let teamMode: number = 1;
  $: equipments = [findItemById(119401), null, null, null, null, null];
  $: char = findCharacterById(selectedCharacter);
  $: atk =
    (equipments.reduce((acc, item) => acc + (item?.atk ?? 0), 0) +
      equipments.reduce((acc, item) => acc + (item?.atkLv ?? 0), 0) * lv +
      (char?.atk ?? 0) +
      (char?.atkLv ?? 0) * lv) |
    0;
  $: asr = Math.min(
    Math.max(
      equipments.reduce((acc, item) => acc + (item?.asr ?? 0), 0) +
        equipments.reduce((acc, item) => acc + (item?.asrLv ?? 0), 0) * lv +
        (char?.as ?? 0) +
        (char?.asLv ?? 0) * lv,
      char?.asm ?? 0
    ),
    char?.asl ?? 2.5
  );
  $: cc =
    Math.min(
      1,
      ((equipments.reduce((acc, item) => acc + (item?.cc ?? 0), 0) * 100) | 0) /
        100
    ) +
    (char?.cc ?? 0) +
    (char?.ccLv ?? 0) * lv;
  $: cd = 1.7 + equipments.reduce((acc, item) => acc + (item?.cd ?? 0), 0);
  let selectedCharacter = 10;
  let selectedWeaponType: ItemType = "Nunchaku";
  let selectedItemSlot: number = 0;
  $: weaponTypesByCharacter = sw
    .filter((x) => x[1] === selectedCharacter)
    .map((x) => x[2]);
  const gradeToScore = (grade: ItemGrade): number => {
    switch (grade) {
      case "common":
        return 0;
      case "uncommon":
        return 1;
      case "rare":
        return 2;
      case "epic":
        return 3;
      case "legendary":
        return 4;
      case "mythic":
        return 5;
    }
  };
  const filterItems = (
    selectedItemSlot: number,
    selectedWeaponType: ItemType,
    teamMode: number
  ) => {
    const selectedItemType = ((selectedItemSlot: number) => {
      switch (selectedItemSlot) {
        case 0:
          return selectedWeaponType;
        case 1:
          return "Chest";
        case 2:
          return "Head";
        case 3:
          return "Arm";
        case 4:
          return "Leg";
        case 5:
          return "Trinket";
      }
    })(selectedItemSlot);
    if (selectedItemType == null) return [];
    const items = findItemByType(selectedItemType).filter(
      (item) => item.modeType === 0 || item.modeType & (1 << (teamMode - 1))
    );
    items.sort((a, b) => {
      return gradeToScore(b.grade) - gradeToScore(a.grade);
    });
    return items;
  };
  $: filteredItems = filterItems(
    selectedItemSlot,
    selectedWeaponType,
    teamMode
  );
  $: ayaGgLink = `https://aya.gg/route?sw1=${
    sw.find(
      (x) => x[1] === selectedCharacter && x[2] === selectedWeaponType
    )?.[0] ?? ""
  }&i1=${equipments
    .filter(<T extends unknown>(x: T | undefined | null): x is T => x != null)
    .map((x) => x.id)}`;
</script>

<div class="container">
  <div>
    <select bind:value={teamMode}>
      <option value={1}>솔로</option>
      <option value={2}>듀오</option>
      <option value={3}>스쿼드</option>
    </select>
    <select bind:value={selectedCharacter}>
      {#each characters as character}
        <option value={character.id}>{character.name}</option>
      {/each}
    </select>
    <div class="character-stat">
      <div>공격력</div>
      <div>
        {((char?.atk ?? 0) + (char?.atkLv ?? 0) * lv) | 0}
      </div>
      <div>공격속도</div>
      <div>
        {(char?.as ?? 0) + (char?.asLv ?? 0) * lv}
      </div>
    </div>
  </div>
  <div>
    <div class="equipments">
      {#each equipments as item, index}
        <Item id={item?.id ?? 0} on:click={() => (selectedItemSlot = index)} />
      {/each}
    </div>
    <div>공격력 {atk}</div>
    <div>공격속도 {asr * 100 | 0}%</div>
    <div>치명타 확률 {cc * 100 | 0}%</div>
    <div>치명타 피해량 {cd * 100 | 0}%</div>
  </div>
  <div class="items">
    {#if selectedItemSlot === 0}
      <select bind:value={selectedWeaponType}>
        {#each weaponTypesByCharacter as weaponType}
          <option value={weaponType}>{weaponType}</option>
        {/each}
      </select>
    {/if}
    {#each filteredItems as item}
      <Item
        id={item.id}
        on:click={() => {
          equipments[selectedItemSlot] = item;
        }}
      />
    {/each}
  </div>
</div>
<a href={ayaGgLink} target="_blank">이 구성으로 루트 짜기(aya.gg)</a>

<style>
  .container {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
  }
  .character-stat {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
  }
  .equipments {
    display: grid;
    grid-template-columns: repeat(3, 62px);
    gap: 4px;
  }
  .items {
    display: grid;
    grid-template-columns: repeat(3, 62px);
    gap: 4px;
  }
</style>
