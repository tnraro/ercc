<script lang="ts">
  import Item from "../../comps/Item.svelte";
  import { findItemByType, type ItemType } from "../../lib/items";
  import { floating } from "../floating/floating";

  export let itemIdSetBy: Record<string, Set<number>> = {
    Chest: new Set(),
    Head: new Set(),
    Arm: new Set(),
    Leg: new Set(),
  };
  function add(type: string, itemId: number) {
    itemIdSetBy[type].add(itemId);
    itemIdSetBy = itemIdSetBy;
  }
  function remove(type: string, itemId: number) {
    itemIdSetBy[type].delete(itemId);
    itemIdSetBy = itemIdSetBy;
  }

  let selected:
    | {
        type: string;
        trigger: HTMLElement;
      }
    | undefined;
  $: itemsBySelectedType = findItemByType(selected?.type as ItemType);
  function close() {
    selected = undefined;
  }
  function open(type: string, trigger: HTMLElement | EventTarget | null) {
    selected = {
      type,
      trigger: trigger as HTMLElement,
    };
  }
</script>

<div class="grid">
  <div class="header">옷</div>
  <div class="header">머</div>
  <div class="header">팔/장</div>
  <div class="header">다리</div>
  {#each Object.entries(itemIdSetBy) as [type, itemIdSet]}
    <div class="items">
      {#each itemIdSet as itemId}
        <Item id={itemId} on:click={() => remove(type, itemId)} />
      {/each}
      <Item
        on:click={(e) => {
          if (selected?.type === type) {
            close();
          } else {
            open(type, e.currentTarget);
          }
        }}>추가</Item
      >
    </div>
  {/each}
</div>

{#if selected != null}
  <div
    class="item-selector"
    use:floating={{ target: selected.trigger, auto: true }}
  >
    {#each itemsBySelectedType as item}
      <Item
        id={item.id}
        on:click={() => {
          if (selected == null) return;
          add(selected.type, item.id);
          close();
        }}
      />
    {/each}
  </div>
{/if}

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(4, max-content);
    gap: 0.5rem;
  }
  .header {
    font-weight: 700;
    text-align: center;
  }
  .items {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .item-selector {
    display: grid;
    grid-template-columns: repeat(auto-fill, 4rem);
    gap: 0.25rem;
    width: 21rem;
    background: hsl(210deg 5% 10%);
    box-shadow: 0 3px 8px -1px hsl(210deg 5% 10% / 0.2);
    padding: 1rem;
  }
</style>
