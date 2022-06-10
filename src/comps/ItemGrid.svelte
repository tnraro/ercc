<script lang="ts">
  import Item from "./Item.svelte";

  export let e0 = 0;
  export let e1 = 0;
  export let e2 = 0;
  export let e3 = 0;
  export let e4 = 0;
  export let e5 = 0;
  $: equipments = [e0, e1, e2, e3, e4, e5];
</script>

<div class="container">
  {#each equipments as itemId}
    <Item id={itemId} />
  {/each}
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: repeat(3, 62px);
    gap: 4px;
  }
</style>
