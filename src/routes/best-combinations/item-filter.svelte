<script lang="ts" module>
  export type ItemFilterKey = "Chest" | "Head" | "Arm" | "Leg";
  export type ItemFilterItems = {
    [key in ItemFilterKey]: Set<number>;
  };
</script>

<script lang="ts">
  import Item from "$lib/components/item/item.svelte";
  import { buttonVariants } from "$lib/components/ui/button";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "$lib/components/ui/popover";
  import { findItemByType } from "$lib/items";
  import { Plus } from "lucide-svelte";

  interface Props {
    items: ItemFilterItems;
  }
  let { items = $bindable() }: Props = $props();

  const secondaryButtonStyle = buttonVariants({
    size: "default",
    variant: "secondary",
  });

  function add(type: ItemFilterKey, id: number) {
    if (items[type].has(id)) return;
    items[type].add(id);
    items = { ...items };
  }
  function remove(type: ItemFilterKey, id: number) {
    if (!items[type].has(id)) return;
    items[type].delete(id);
    items = { ...items };
  }
</script>

<div class="flex flex-col gap-1">
  {@render selectedItems("Chest", "옷")}
  {@render selectedItems("Head", "머")}
  {@render selectedItems("Arm", "팔")}
  {@render selectedItems("Leg", "다")}
</div>

{#snippet itemSelector(key: ItemFilterKey)}
  <div class="item-selector">
    {#each findItemByType(key)
      .filter((item) => !items[key].has(item.id))
      .sort((a, b) => a.grade.localeCompare(b.grade)) as item (item.id)}
      <Item size="md" id={item.id} onclick={(id) => add(key, id)} />
    {/each}
  </div>
{/snippet}

{#snippet selectedItems(key: ItemFilterKey, label: string)}
  <div class="flex items-center gap-4">
    <Popover>
      <PopoverTrigger class={secondaryButtonStyle}>
        <Plus />{label}
      </PopoverTrigger>
      <PopoverContent class="w-[calc(302px_+_4rem)]">
        {@render itemSelector(key)}
      </PopoverContent>
    </Popover>
    {#if items[key].size}
      <div
        class="inline-flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-input px-3 py-1"
      >
        {#each items[key] as id (id)}
          <Item size="sm" {id} onclick={() => remove(key, id)} />
        {/each}
      </div>
    {/if}
  </div>
{/snippet}

<style lang="scss">
  .item-selector {
    display: grid;
    grid-template-columns: repeat(auto-fill, 60px);
    margin: 0 auto;
    @apply gap-x-2 gap-y-1;
  }
</style>
