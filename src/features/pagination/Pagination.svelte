<script lang="ts" generics="T">
  function getButtons(items: T[], page: number, windowSize: number) {
    const start = Math.max(page - Math.floor(windowSize / 2), 0);
    const end = Math.min(
      start + windowSize,
      Math.ceil(items.length / windowSize),
    );
    return Array.from({ length: end - start }).map((_, i) => start + i + 1);
  }
  function go(to: number) {
    page = clamp(to, 0, Math.ceil(items.length / windowSize) - 1);
    function clamp(x: number, min: number, max: number) {
      return Math.min(max, Math.max(min, x));
    }
  }
  function filterItems(items: T[], page: number, windowSize: number) {
    return items.slice(page * windowSize, page * windowSize + windowSize);
  }
  export let items: T[];
  export let windowSize = 10;

  let page = 0;

  $: filteredItems = filterItems(items, page, windowSize);
  $: buttons = getButtons(items, page, windowSize);
</script>

<div class="items">
  {#each filteredItems as item}
    <slot name="item" {item} />
  {/each}
</div>

<div class="pagination">
  <div class="buttons">
    <button on:click={() => go(0)}>|&lt;</button>
    <button on:click={() => go(page - 1)}>&lt;</button>
  </div>
  <div class="buttons">
    {#each buttons as pageNum}
      <button
        class:current-page={pageNum - 1 === page}
        on:click={() => go(pageNum - 1)}
      >
        {pageNum}
      </button>
    {/each}
  </div>
  <div class="buttons">
    <button on:click={() => go(page + 1)}>&gt;</button>
    <button on:click={() => go(Number.MAX_SAFE_INTEGER)}>&gt;|</button>
  </div>
</div>

<style>
  .items {
    display: flex;
    flex-flow: column;
    gap: 0.25rem;
  }
  .pagination {
    display: flex;
    justify-content: space-between;
  }
  .buttons {
    display: flex;
    gap: 0.25rem;
  }
  .current-page {
    background: brown;
    color: white;
  }
</style>
