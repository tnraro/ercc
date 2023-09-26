<script lang="ts">
  import Item from "../comps/Item.svelte";
  import { findItemById, items } from "../lib/items";

  const enum ItemType {
    Weapon,
    Chest,
    Head,
    Arm,
    Leg,
  }

  interface ItemSet {
    equipments: (number | undefined)[];
    meta: Record<string, number>;
  }
  let itemsets: ItemSet[] = [];
  let itemType = ItemType.Weapon;
  let isFloating = false;
  let equipments: (number | undefined)[] = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  const getItemsByType = (itemType: ItemType) => {
    if (itemType === ItemType.Weapon) {
      return items.filter(
        (item) => !["Chest", "Head", "Arm", "Leg"].includes(item.type)
      );
    }
    const type = ["Chest", "Head", "Arm", "Leg"][itemType - 1];
    return items.filter((item) => item.type === type);
  };
</script>

<div>
  <div class="equipments">
    {#each equipments as equipment, i}
      <Item
        id={equipment}
        on:click={() => {
          if (itemType === i && isFloating) blur();
          else focus();
          itemType = i;
        }}>{"무옷머팔다"[i]}</Item
      >
    {/each}
    <button
      on:click={() => {
        blur();
        // @ts-ignore
        const its = equipments.map(id => findItemById(id)).filter((x) => x != null);
        its.reduce((a, x) => a + x.atk, 0);
        itemsets = [...itemsets, {
          equipments: [...equipments],
          meta: {}
        }];
        equipments = [undefined, undefined, undefined, undefined, undefined];
      }}>추가</button
    >
  </div>
  {#if isFloating}
    <div class="items">
      {#each getItemsByType(itemType) as item (item.id)}
        <Item id={item.id} on:click={() => (equipments[itemType] = item.id)} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .equipments {
    display: flex;
    gap: 0.25rem;
  }
  .items {
    display: flex;
    background: hsl(210deg 5% 10%);
    flex-flow: wrap;
    gap: 0.25rem;
    max-width: 640px;
    box-shadow: 0 3px 8px -1px hsl(210deg 5% 10% / 0.2);
    padding: 1rem;
  }
</style>
