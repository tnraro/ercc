<script lang="ts">
  import type { ItemSize } from "../item/item.svelte";
  import Item from "../item/item.svelte";

  interface Props {
    equipments: number[];
    size: ItemSize;
  }
  let { equipments, size }: Props = $props();
</script>

<div class="flex justify-end gap-1">
  {#each equipments as id (id)}
    <Item {size} {id} />
  {/each}
</div>
