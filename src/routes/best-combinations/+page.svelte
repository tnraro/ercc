<script lang="ts">
  import type { Character } from "$lib/characters";
  import {
    columns,
    type EquipmentStat,
  } from "$lib/components/equipment-stat/columns";
  import EquipmentStatTable from "$lib/components/equipment-stat/equipment-stat-table.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label";
  import { items, type ItemData } from "$lib/items";
  import { sw } from "$lib/sw";
  import { LoaderCircle } from "lucide-svelte";
  import { getContext } from "svelte";
  import ItemFilter, {
    type ItemFilterItems,
    type ItemFilterKey,
  } from "./item-filter.svelte";

  interface PlayerStat {
    character: Character | undefined;
    weaponType: string | undefined;
    weapon: ItemData | undefined;
    characterLevel: number;
    weaponLevel: number;
    targetDefense: number;
  }
  const playerStat = getContext<() => PlayerStat>("player-stat");
  let {
    character,
    weaponType,
    weapon,
    characterLevel,
    weaponLevel,
    targetDefense,
  } = $derived(playerStat());

  let includeLegendaryItem = $state(false);
  let includeMythicItem = $state(false);
  let includedItems = $state.raw<ItemFilterItems>({
    Chest: new Set(),
    Head: new Set(),
    Arm: new Set(),
    Leg: new Set(),
  });
  let includedItemsCount = $derived(
    includedItems.Chest.size +
      includedItems.Head.size +
      includedItems.Arm.size +
      includedItems.Leg.size,
  );
  let excludedItems = $state.raw<ItemFilterItems>({
    Chest: new Set(),
    Head: new Set(),
    Arm: new Set(),
    Leg: new Set(),
  });
  let excludedItemsCount = $derived(
    excludedItems.Chest.size +
      excludedItems.Head.size +
      excludedItems.Arm.size +
      excludedItems.Leg.size,
  );

  let combinations = $state.raw<EquipmentStat[]>([]);
  let showLoading = $state(false);

  function createCombination() {
    showLoading = true;
    if (weapon == null || character == null || weaponType == null) return [];

    const filteredItems = items
      .filter(
        (item) =>
          item.atk !== 0 ||
          item.atkLv !== 0 ||
          item.asr !== 0 ||
          item.asrLv !== 0 ||
          item.cc !== 0 ||
          item.cd !== 0 ||
          item.pd !== 0 ||
          item.pdr !== 0 ||
          item.upd !== 0 ||
          item.updr !== 0,
      )
      .filter((item) => includeLegendaryItem || item.grade !== "legendary")
      .filter((item) => includeMythicItem || item.grade !== "mythic");

    const itemsBy = (["Chest", "Head", "Arm", "Leg"] as ItemFilterKey[]).reduce(
      (acc, type) => ({
        ...acc,
        [type.toLowerCase()]: filteredItems
          .filter((item) => item.type === type)
          .filter(
            (item) =>
              excludedItems[type].size === 0 ||
              !excludedItems[type].has(item.id),
          )
          .filter(
            (item) =>
              includedItems[type].size === 0 ||
              includedItems[type].has(item.id),
          ),
      }),
      {} as Record<Lowercase<ItemFilterKey>, ItemData[]>,
    );

    const weaponData = sw.find(
      ({ id, weaponType }) => id === character.id && weaponType === weaponType,
    )!.stats;

    const worker = new Worker(new URL("./calc-combination", import.meta.url), {
      type: "module",
    });
    worker.onmessage = (e: MessageEvent<EquipmentStat[]>) => {
      combinations = e.data;
      showLoading = false;
    };
    worker.postMessage({
      character: $state.snapshot(character),
      characterLevel: $state.snapshot(characterLevel),
      weapon: $state.snapshot(weapon),
      weaponLevel: $state.snapshot(weaponLevel),
      targetDefense: $state.snapshot(targetDefense),
      weaponType: $state.snapshot(weaponType),
      weaponData,
      itemsBy,
    });
  }
</script>

<div class="flex flex-col gap-2">
  <div class="option">
    <Checkbox id="include-legendary-item" bind:checked={includeLegendaryItem} />
    <Label for="include-legendary-item">전설 아이템 포함</Label>
  </div>
  <div class="option">
    <Checkbox id="include-mythic-item" bind:checked={includeMythicItem} />
    <Label for="include-mythic-item">신화 아이템 포함</Label>
  </div>
  <details>
    <summary
      >포함 아이템{includedItemsCount > 0
        ? ` (${includedItemsCount})`
        : ""}</summary
    >
    <ItemFilter bind:items={includedItems} />
  </details>
  <details>
    <summary
      >제외 아이템{excludedItemsCount > 0
        ? ` (${excludedItemsCount})`
        : ""}</summary
    >
    <ItemFilter bind:items={excludedItems} />
  </details>
  <Button onclick={createCombination} disabled={showLoading}>
    {#if showLoading}
      <LoaderCircle class="animate-spin" />
    {/if}
    조합 계산하기
  </Button>
</div>
<EquipmentStatTable data={combinations} {columns} />

<style lang="scss">
  .option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
