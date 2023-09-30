<script lang="ts">
  import Item from "../comps/Item.svelte";
  import { type PlayerStateOptions } from "../comps/PlayerState.svelte";
  import { hit, type HitContext } from "../lib/calc/pipe";
  import { findItemById, items } from "../lib/items";
  import { weaponTypeInfo } from "../lib/weaponTypeInfo";

  // types
  const enum ItemType {
    Weapon,
    Chest,
    Head,
    Arm,
    Leg,
  }
  interface ItemSet {
    equipments: (number | undefined)[];
    hit: HitContext;
  }

  // consts
  const getItemsByType = (itemType: ItemType, weaponSubType: string) => {
    if (itemType === ItemType.Weapon) {
      return items.filter((item) => item.type === weaponSubType);
    }
    const type = ["Chest", "Head", "Arm", "Leg"][itemType - 1];
    return items.filter((item) => item.type === type);
  };
  const focus = () => (isFloating = true);
  const blur = () => (isFloating = false);
  const weaponTypes = [...weaponTypeInfo.keys()];

  // props
  export let playerState: PlayerStateOptions;

  // states
  let itemsets: ItemSet[] = [];
  let itemType = ItemType.Weapon;
  let weaponSubType = weaponTypes[0];
  let isFloating = false;
  let equipments: (number | undefined)[] = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  $: equipments[0] = playerState.weapon?.id;
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
        const its = equipments
          .filter((x) => x != null)
          .map((id) => findItemById(id))
          .filter((x) => x != null);

        const atk = its.reduce((a, x) => a + (x?.atk ?? 0), 0);
        const atkLv = its.reduce((a, x) => a + (x?.atkLv ?? 0), 0);
        const asr = its.reduce((a, x) => a + (x?.asr ?? 0), 0);
        const asrLv = its.reduce((a, x) => a + (x?.asrLv ?? 0), 0);
        const cc = its.reduce((a, x) => a + (x?.cc ?? 0), 0);
        const cd = its.reduce((a, x) => a + (x?.cd ?? 0), 0);
        const pd = its.reduce((a, x) => a + (x?.pd ?? 0), 0);
        const pdr = its.reduce((a, x) => a + (x?.pdr ?? 0), 0);
        const upd = its.reduce((a, x) => a + (x?.upd ?? 0), 0);
        const updr = its.reduce((a, x) => a + (x?.updr ?? 0), 0);
        itemsets = [
          ...itemsets,
          {
            equipments: [...equipments],
            hit: hit(playerState, {
              atk,
              atkLv,
              asr,
              asrLv,
              cc,
              cd,
              pd,
              pdr,
              upd,
              updr,
            }),
          },
        ];
      }}>추가</button
    >
  </div>
  {#if isFloating}
    <div class="items">
      {#if itemType === /* ItemType.Weapon */ 0}
        <div class="items__filter">
          {#each weaponTypes as weaponType}
            <button
              class="items__button"
              on:click={() => (weaponSubType = weaponType)}
            >
              <img
                class="items__image"
                width="24"
                height="24"
                src="https://er-static.pages.dev/image/icon/ability/{weaponType}.webp"
                alt={weaponType}
                title={weaponType}
              />
            </button>
          {/each}
        </div>
      {/if}
      <div class="items__items">
        {#each getItemsByType(itemType, weaponSubType) as item (item.id)}
          <Item
            id={item.id}
            on:click={() => (equipments[itemType] = item.id)}
          />
        {/each}
      </div>
    </div>
  {/if}
</div>
<div>
  {#each itemsets as itemset}
    <div class="itemset">
      {#each itemset.equipments as id}
        <Item {id} />
      {/each}
      <div>DPS{itemset.hit.dps.toFixed(2)}</div>
      <div>피해{itemset.hit.damage}</div>
      <div>공속{itemset.hit.as.toFixed(2)}</div>
      <div>공격력{itemset.hit.meta.atk}</div>
      <button
        on:click={() => (itemsets = itemsets.filter((is) => is !== itemset))}
        >delete</button
      >
    </div>
  {/each}
</div>

<style>
  .equipments {
    display: flex;
    gap: 0.25rem;
  }
  .items {
    display: flex;
    flex-direction: column;
    background: hsl(210deg 5% 10%);
    gap: 1rem;
    max-width: 640px;
    box-shadow: 0 3px 8px -1px hsl(210deg 5% 10% / 0.2);
    padding: 1rem;
  }
  .items__items {
    display: flex;
    flex-flow: wrap;
    gap: 0.25rem;
  }
  .items__button {
    background: transparent;
  }
  .items__image {
    object-fit: contain;
  }
  .itemset {
    display: flex;
  }
</style>
